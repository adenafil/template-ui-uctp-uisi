'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Grid3X3, List, MapPin, Users } from 'lucide-react'
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
import { Link } from '@tanstack/react-router'
import type { ScheduleData, ScheduleEntry } from '@/lib/schedule-types'
import { getProdiColor } from '@/lib/schedule-types'
import scheduleDataRaw from '../../data-contoh.json'

const scheduleData = scheduleDataRaw as ScheduleData

// Extended days to include Saturday
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

// Time slots based on actual data
const TIME_SLOTS = [
  { label: '07:30-08:20', start: '07:30', end: '08:20', period: 1 },
  { label: '08:20-09:10', start: '08:20', end: '09:10', period: 2 },
  { label: '09:10-10:00', start: '09:10', end: '10:00', period: 3 },
  { label: '10:00-10:50', start: '10:00', end: '10:50', period: 4 },
  { label: '10:50-11:40', start: '10:50', end: '11:40', period: 5 },
  { label: '11:40-12:30', start: '11:40', end: '12:30', period: 6 },
  { label: '12:30-13:20', start: '12:30', end: '13:20', period: 7 },
  { label: '13:20-14:10', start: '13:20', end: '14:10', period: 8 },
  { label: '14:10-15:00', start: '14:10', end: '15:00', period: 9 },
  { label: '15:00-15:50', start: '15:00', end: '15:50', period: 10 },
  { label: '15:50-16:40', start: '15:50', end: '16:40', period: 11 },
  { label: '16:40-17:30', start: '16:40', end: '17:30', period: 12 },
  { label: '17:30-18:20', start: '17:30', end: '18:20', period: 13 },
  { label: '18:20-19:10', start: '18:20', end: '19:10', period: 14 },
  { label: '19:10-20:00', start: '19:10', end: '20:00', period: 15 },
]

type ViewMode = 'grid' | 'list'

// Extract unique class names from schedule
// Handles multi-class format like "IF-7A,IF-7B" or "SI-3A, SI-7A"
function extractUniqueClasses(schedule: ScheduleEntry[]): string[] {
  const classSet = new Set<string>()
  
  schedule.forEach((entry) => {
    const classField = entry.class
    // Split by comma and clean up whitespace
    const classes = classField.split(',').map(c => c.trim())
    classes.forEach((cls) => {
      if (cls) classSet.add(cls)
    })
  })
  
  return Array.from(classSet).sort()
}

// Filter schedule for a specific class
// Returns entries where the class is included (handles multi-class)
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

export function SchedulePreview() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Extract unique classes from schedule
  const uniqueClasses = useMemo(() => {
    return extractUniqueClasses(scheduleData.schedule)
  }, [])

  // Set default class on first load
  useMemo(() => {
    if (!selectedClass && uniqueClasses.length > 0) {
      // Try to find IF-7A as default, otherwise use first class
      const defaultClass = uniqueClasses.find(c => c.includes('IF-7A')) || uniqueClasses[0]
      setSelectedClass(defaultClass)
    }
  }, [uniqueClasses, selectedClass])

  // Filter schedule by selected class
  const filteredSchedule = useMemo(() => {
    if (!selectedClass) return []
    return filterScheduleByClass(scheduleData.schedule, selectedClass)
  }, [selectedClass])

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

  const dayLabels: Record<string, string> = {
    Monday: 'Sen',
    Tuesday: 'Sel',
    Wednesday: 'Rab',
    Thursday: 'Kam',
    Friday: 'Jum',
    Saturday: 'Sab',
  }

  const fullDayLabels: Record<string, string> = {
    Monday: 'Senin',
    Tuesday: 'Selasa',
    Wednesday: 'Rabu',
    Thursday: 'Kamis',
    Friday: 'Jumat',
    Saturday: 'Sabtu',
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <CardTitle>Jadwal Preview</CardTitle>
          
          {/* Class Selector */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
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
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="grid" className="px-2">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              Lihat Full
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 gap-1">
                {/* Header */}
                <div className="p-2 text-xs font-medium text-muted-foreground">Jam</div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {dayLabels[day]}
                  </div>
                ))}

                {/* Time slots */}
                {TIME_SLOTS.slice(0, 12).map((slot) => (
                  <div key={`row-${slot.start}`} className="contents">
                    <div className="flex items-center p-2 text-xs text-muted-foreground">
                      {slot.start}
                    </div>
                    {DAYS.map((day) => {
                      const entries = getEntriesAtSlot(filteredSchedule, day, slot.start)
                      return (
                        <div
                          key={`${day}-${slot.start}`}
                          className="min-h-[50px] rounded-md border border-border/50 p-1"
                        >
                          {entries.map((entry) => {
                            const colors = getProdiColor(entry.prodi)
                            return (
                              <div
                                key={entry.classId}
                                className={`mb-1 h-full rounded px-1.5 py-1 text-xs border-l-2 ${colors.bg} ${colors.text} ${colors.border}`}
                                title={`${entry.className} - ${entry.room} - ${entry.lecturers.join(', ')}`}
                              >
                                <div className="font-medium truncate">{entry.className}</div>
                                <div className="text-[10px] opacity-80 truncate">
                                  {entry.room} • {entry.sks} SKS
                                </div>
                                {entry.lecturers.length > 0 && (
                                  <div className="text-[9px] opacity-70 truncate">
                                    {entry.lecturers.join(', ')}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {DAYS.map((day) => {
              const dayEntries = entriesByDay[day]
              if (!dayEntries || dayEntries.length === 0) return null

              return (
                <div key={day} className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground sticky top-0 bg-card py-1">
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
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada jadwal untuk kelas {selectedClass}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
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
  )
}
