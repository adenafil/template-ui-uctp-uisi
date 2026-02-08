'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { Calendar, Grid3X3, Info, List, MapPin, Maximize, Minimize, Users } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScheduleCard } from '@/components/schedule/schedule-card'
import { ScheduleEditSheet } from '@/components/schedule/schedule-edit-sheet'
import { DroppableCell } from '@/components/schedule/droppable-cell'
import { DraggableCard } from '@/components/schedule/draggable-card'
import type { ScheduleData, ScheduleEntry } from '@/lib/schedule-types'
import { DAYS, TIME_SLOTS, getProdiColor } from '@/lib/schedule-types'
import scheduleDataRaw from '../../data-contoh.json'

const scheduleData = scheduleDataRaw as ScheduleData

type ViewMode = 'grid' | 'list'

const fullDayLabels: Record<string, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
}

// Extract unique class names from schedule
function extractUniqueClasses(schedule: ScheduleEntry[]): string[] {
  const classSet = new Set<string>()
  
  schedule.forEach((entry) => {
    const classField = entry.class
    const classes = classField.split(',').map(c => c.trim())
    classes.forEach((cls) => {
      if (cls) classSet.add(cls)
    })
  })
  
  return Array.from(classSet).sort()
}

// Filter schedule for a specific class
function filterScheduleByClass(schedule: ScheduleEntry[], selectedClass: string): ScheduleEntry[] {
  return schedule.filter((entry) => {
    const classes = entry.class.split(',').map(c => c.trim())
    return classes.includes(selectedClass)
  })
}

// Get schedule entries for a specific day and time slot
function getEntriesAtSlot(
  filteredSchedule: ScheduleEntry[],
  day: string,
  startTime: string
): ScheduleEntry[] {
  return filteredSchedule.filter(
    (entry) => entry.timeSlot.day === day && entry.timeSlot.startTime === startTime
  )
}

// Helper to convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Calculate row span based on start and end time
const calculateRowSpan = (startTime: string, endTime: string) => {
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  const durationMinutes = endMinutes - startMinutes
  return Math.max(1, Math.ceil(durationMinutes / 50))
}

export function ScheduleSimple() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const timetableRef = useRef<HTMLDivElement>(null)
  const [scheduleState, setScheduleState] = useState<ScheduleData>(scheduleData)
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeEntry, setActiveEntry] = useState<ScheduleEntry | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Extract unique classes from schedule
  const uniqueClasses = useMemo(() => {
    return extractUniqueClasses(scheduleState.schedule)
  }, [scheduleState.schedule])

  // Set default class on first load
  useMemo(() => {
    if (!selectedClass && uniqueClasses.length > 0) {
      const defaultClass = uniqueClasses.find(c => c.includes('IF-7A')) || uniqueClasses[0]
      setSelectedClass(defaultClass)
    }
  }, [uniqueClasses, selectedClass])

  // Filter schedule by selected class
  const filteredSchedule = useMemo(() => {
    if (!selectedClass) return []
    return filterScheduleByClass(scheduleState.schedule, selectedClass)
  }, [selectedClass, scheduleState.schedule])

  // Group entries by day for list view
  const entriesByDay = useMemo(() => {
    const grouped: Record<string, ScheduleEntry[]> = {}
    DAYS.forEach((day) => {
      grouped[day] = filteredSchedule
        .filter((entry) => entry.timeSlot.day === day)
        .sort((a, b) => a.timeSlot.startTime.localeCompare(b.timeSlot.startTime))
    })
    return grouped
  }, [filteredSchedule])

  // Get unique rooms for edit sheet
  const rooms = useMemo(() => {
    return Array.from(new Set(scheduleState.schedule.map((entry) => entry.room))).sort()
  }, [scheduleState.schedule])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const entry = filteredSchedule.find(
      (e) => `${e.classId}-${e.timeSlot.day}-${e.timeSlot.startTime}` === active.id
    )
    setActiveEntry(entry || null)
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveEntry(null)

      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      // Parse the over ID to get day and time slot
      const [targetDay, targetTime] = overId.split('|')
      if (!targetDay || !targetTime) return

      // Find the dragged entry
      const entryIndex = scheduleState.schedule.findIndex(
        (e) => `${e.classId}-${e.timeSlot.day}-${e.timeSlot.startTime}` === activeId
      )
      if (entryIndex === -1) return

      const entry = scheduleState.schedule[entryIndex]

      // Calculate duration of the original entry in minutes
      const originalStartMinutes = timeToMinutes(entry.timeSlot.startTime)
      const originalEndMinutes = timeToMinutes(entry.timeSlot.endTime)
      const durationMinutes = originalEndMinutes - originalStartMinutes

      // Calculate new end time based on original duration
      const newStartMinutes = timeToMinutes(targetTime)
      const newEndMinutes = newStartMinutes + durationMinutes

      // Convert back to time string
      const endHours = Math.floor(newEndMinutes / 60)
      const endMins = newEndMinutes % 60
      const newEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

      // Update the schedule
      const updatedSchedule = [...scheduleState.schedule]
      updatedSchedule[entryIndex] = {
        ...entry,
        timeSlot: {
          ...entry.timeSlot,
          day: targetDay,
          startTime: targetTime,
          endTime: newEndTime,
        },
      }

      setScheduleState({
        ...scheduleState,
        schedule: updatedSchedule,
      })
    },
    [scheduleState, filteredSchedule]
  )

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingEntry(entry)
    setIsEditOpen(true)
  }

  const handleDelete = (entry: ScheduleEntry) => {
    setScheduleState({
      ...scheduleState,
      schedule: scheduleState.schedule.filter(
        (e) =>
          !(
            e.classId === entry.classId &&
            e.room === entry.room &&
            e.timeSlot.startTime === entry.timeSlot.startTime
          )
      ),
    })
  }

  const handleSave = (updatedEntry: ScheduleEntry) => {
    if (!editingEntry) return

    const updatedSchedule = scheduleState.schedule.map((e) =>
      e.classId === editingEntry.classId &&
      e.room === editingEntry.room &&
      e.timeSlot.startTime === editingEntry.timeSlot.startTime
        ? updatedEntry
        : e
    )

    setScheduleState({
      ...scheduleState,
      schedule: updatedSchedule,
    })
    setEditingEntry(null)
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await timetableRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.7))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <DashboardHeader
            title="Schedule Simple"
            description="Class-based schedule view with drag and drop"
          />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-full space-y-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-chart-4/10 border border-chart-4/20">
                    <Calendar className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Class Schedule</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClass ? `Viewing schedule for ${selectedClass}` : 'Select a class to view schedule'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    {viewMode === 'grid' ? 'Edit Mode' : 'View Mode'}
                  </Badge>
                </div>
              </div>

              {/* Controls Bar */}
              <Card className="border-border/60">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Class Selector */}
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueClasses.map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* View Mode Toggle */}
                      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                        <TabsList className="h-9">
                          <TabsTrigger value="grid" className="gap-2">
                            <Grid3X3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Grid</span>
                          </TabsTrigger>
                          <TabsTrigger value="list" className="gap-2">
                            <List className="h-4 w-4" />
                            <span className="hidden sm:inline">List</span>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Fullscreen Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="gap-2"
                      >
                        {isFullscreen ? (
                          <>
                            <Minimize className="h-4 w-4" />
                            <span className="hidden sm:inline">Exit</span>
                          </>
                        ) : (
                          <>
                            <Maximize className="h-4 w-4" />
                            <span className="hidden sm:inline">Full</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Banner */}
              <Card className="border-border/60 bg-muted/30">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-primary/10 mt-0.5">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Tip:</span>{' '}
                        {viewMode === 'grid' 
                          ? 'Drag and drop course cards to reschedule to different days or times. Click on any card to edit details.'
                          : 'List view shows all schedules grouped by day. Switch to Grid view to edit with drag and drop.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Content */}
              <div 
                ref={timetableRef}
                className={`relative ${isFullscreen ? 'h-screen w-screen overflow-auto bg-background p-6' : ''}`}
              >
                <Card className={`border-border/60 shadow-sm ${isFullscreen ? 'min-h-full' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg">
                          {selectedClass ? `${selectedClass} Schedule` : 'Select a Class'}
                        </CardTitle>
                        {isFullscreen && viewMode === 'grid' && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleZoomOut}
                              className="h-7 px-2 text-xs"
                            >
                              −
                            </Button>
                            <span className="text-xs text-muted-foreground min-w-[50px] text-center">
                              {Math.round(zoomLevel * 100)}%
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleZoomIn}
                              className="h-7 px-2 text-xs"
                            >
                              +
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResetZoom}
                              className="h-7 px-2 text-xs"
                            >
                              Reset
                            </Button>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {filteredSchedule.length} Courses
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {viewMode === 'grid' ? (
                      /* Grid View with DnD */
                      <div 
                        className="overflow-x-auto"
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
                      >
                      <div className="min-w-[900px]">
                        <div className="grid grid-cols-6 gap-1">
                          {/* Header */}
                          <div className="p-2 text-xs font-medium text-muted-foreground sticky left-0 bg-card z-10">
                            Jam
                          </div>
                          {DAYS.map((day) => (
                            <div
                              key={day}
                              className="p-2 text-center text-xs font-medium text-muted-foreground bg-muted/50 rounded-t-md"
                            >
                              {fullDayLabels[day]}
                            </div>
                          ))}

                          {/* Time slots */}
                          {TIME_SLOTS.slice(0, 12).map((slot) => (
                            <div key={`row-${slot.start}`} className="contents">
                              <div className="flex items-center p-2 text-xs text-muted-foreground sticky left-0 bg-card z-10 border-r">
                                {slot.start}
                              </div>
                              {DAYS.map((day) => {
                                const entries = getEntriesAtSlot(filteredSchedule, day, slot.start)
                                const entry = entries[0] // Take first entry for this slot
                                
                                // Check if this cell is part of a multi-row entry from above
                                const isOccupied = filteredSchedule.some((e) => {
                                  if (e.timeSlot.day !== day) return false
                                  const entryStart = e.timeSlot.startTime
                                  const entryEnd = e.timeSlot.endTime
                                  return slot.start > entryStart && slot.start < entryEnd
                                })

                                if (isOccupied) {
                                  return (
                                    <div
                                      key={`${day}-${slot.start}`}
                                      className="min-h-[60px] rounded-md border border-border/30 p-1 bg-muted/20"
                                    />
                                  )
                                }

                                const rowSpan = entry
                                  ? calculateRowSpan(entry.timeSlot.startTime, entry.timeSlot.endTime)
                                  : 1

                                return (
                                  <DroppableCell
                                    key={`${day}-${slot.start}`}
                                    id={`${day}|${slot.start}`}
                                    className="relative min-h-[60px] rounded-md border border-border/50 p-1"
                                  >
                                    {entry && (
                                      <DraggableCard
                                        id={`${entry.classId}-${entry.timeSlot.day}-${entry.timeSlot.startTime}`}
                                        entry={entry}
                                        style={{
                                          height: `calc(${rowSpan * 60}px - 4px)`,
                                        }}
                                      >
                                        <ScheduleCard
                                          entry={entry}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          isDragging={
                                            activeEntry?.classId === entry.classId &&
                                            activeEntry?.timeSlot.day === entry.timeSlot.day
                                          }
                                        />
                                      </DraggableCard>
                                    )}
                                  </DroppableCell>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List View (Read-only) */
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {DAYS.map((day) => {
                        const dayEntries = entriesByDay[day]
                        if (!dayEntries || dayEntries.length === 0) return null

                        return (
                          <div key={day} className="space-y-2">
                            <h4 className="font-semibold text-sm text-muted-foreground sticky top-0 bg-card py-2 border-b">
                              {fullDayLabels[day]}
                            </h4>
                            <div className="space-y-2">
                              {dayEntries.map((entry) => {
                                const colors = getProdiColor(entry.prodi)
                                return (
                                  <div
                                    key={entry.classId}
                                    className={`flex items-start gap-3 rounded-lg border p-3 border-l-4 ${colors.bg} ${colors.border}`}
                                  >
                                    <div className="flex flex-col items-center min-w-[70px] text-center">
                                      <span className="text-xs font-medium text-muted-foreground">
                                        {entry.timeSlot.startTime}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {entry.timeSlot.endTime}
                                      </span>
                                      <Badge variant="secondary" className="mt-1 text-[9px]">
                                        {entry.sks} SKS
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <h5 className="font-medium text-sm truncate">{entry.className}</h5>
                                          <p className={`text-xs ${colors.text}`}>{entry.prodi}</p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEdit(entry)}
                                          className="h-7 px-2"
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                      
                                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {entry.room}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          {entry.participants} mhs
                                        </span>
                                        {entry.needsLab && (
                                          <Badge variant="outline" className="text-[9px]">
                                            Lab
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      {entry.lecturers.length > 0 && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                          Dosen: {entry.lecturers.join(', ')}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                      
                      {filteredSchedule.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>Tidak ada jadwal untuk kelas {selectedClass}</p>
                          <p className="text-sm mt-1">Pilih kelas lain atau tambahkan jadwal baru</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legend */}
                  <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
                    <span className="text-xs text-muted-foreground mr-2">Program Studi:</span>
                    {Object.entries({
                      'INFORMATIKA': 'bg-violet-500/10 text-violet-400',
                      'SISTEM INFORMASI': 'bg-cyan-500/10 text-cyan-400',
                      'MANAJEMEN': 'bg-blue-500/10 text-blue-400',
                      'Akuntansi': 'bg-amber-500/10 text-amber-400',
                      'Teknik Kimia': 'bg-orange-500/10 text-orange-400',
                      'TEKNIK LOGISTIK': 'bg-rose-500/10 text-rose-400',
                    }).map(([prodi, colorClass]) => (
                      <Badge
                        key={prodi}
                        variant="outline"
                        className={`text-[10px] ${colorClass}`}
                      >
                        {prodi}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* Drag overlay */}
      <DragOverlay>
        {activeEntry && (
          <div
            className="w-full opacity-90"
            style={{
              height: `calc(${calculateRowSpan(activeEntry.timeSlot.startTime, activeEntry.timeSlot.endTime) * 60}px - 4px)`,
            }}
          >
            <ScheduleCard
              entry={activeEntry}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging
            />
          </div>
        )}
      </DragOverlay>

      {/* Edit sheet */}
      <ScheduleEditSheet
        entry={editingEntry}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={handleSave}
        availableRooms={rooms}
      />
    </DndContext>
  )
}
