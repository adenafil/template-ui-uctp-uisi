'use client'

import { useState, useCallback } from 'react'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScheduleCard } from './schedule-card'
import { ScheduleEditSheet } from './schedule-edit-sheet'
import { DroppableCell } from './droppable-cell'
import { DraggableCard } from './draggable-card'
import type { ScheduleEntry, ScheduleData } from '@/lib/schedule-types'
import { DAYS, TIME_SLOTS } from '@/lib/schedule-types'

interface ScheduleGridProps {
  initialData: ScheduleData
  zoomLevel?: number
}

export function ScheduleGrid({ initialData, zoomLevel = 1 }: ScheduleGridProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleData>(initialData)
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeEntry, setActiveEntry] = useState<ScheduleEntry | null>(null)

  const currentDay = DAYS[currentDayIndex]

  // Get unique rooms from schedule
  const rooms = Array.from(
    new Set(scheduleData.schedule.map((entry) => entry.room))
  ).sort()

  // Filter entries for current day
  const dayEntries = scheduleData.schedule.filter(
    (entry) => entry.timeSlot.day === currentDay
  )

  // Helper to convert time string to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Get entry at specific position
  const getEntryAtPosition = (room: string, timeSlotStart: string) => {
    return dayEntries.find(
      (entry) =>
        entry.room === room && entry.timeSlot.startTime === timeSlotStart
    )
  }

  // Check if a cell is occupied by an entry that spans multiple rows
  const isCellOccupied = (room: string, timeSlotStart: string) => {
    return dayEntries.some((entry) => {
      if (entry.room !== room) return false
      const entryStart = entry.timeSlot.startTime
      const entryEnd = entry.timeSlot.endTime
      return timeSlotStart >= entryStart && timeSlotStart < entryEnd
    })
  }

  // Calculate row span based on start and end time using minutes
  const calculateRowSpan = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const durationMinutes = endMinutes - startMinutes
    // Each slot is 50 minutes
    return Math.max(1, Math.ceil(durationMinutes / 50))
  }

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
    const entry = scheduleData.schedule.find(
      (e) => `${e.classId}-${e.room}-${e.timeSlot.startTime}` === active.id
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

      // Parse the over ID to get room and time slot
      const [targetRoom, targetTime] = overId.split('|')
      if (!targetRoom || !targetTime) return

      // Find the dragged entry
      const entryIndex = scheduleData.schedule.findIndex(
        (e) => `${e.classId}-${e.room}-${e.timeSlot.startTime}` === activeId
      )
      if (entryIndex === -1) return

      const entry = scheduleData.schedule[entryIndex]

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
      const updatedSchedule = [...scheduleData.schedule]
      updatedSchedule[entryIndex] = {
        ...entry,
        room: targetRoom,
        timeSlot: {
          ...entry.timeSlot,
          startTime: targetTime,
          endTime: newEndTime,
        },
      }

      setScheduleData({
        ...scheduleData,
        schedule: updatedSchedule,
      })
    },
    [scheduleData]
  )

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingEntry(entry)
    setIsEditOpen(true)
  }

  const handleDelete = (entry: ScheduleEntry) => {
    setScheduleData({
      ...scheduleData,
      schedule: scheduleData.schedule.filter(
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

    const updatedSchedule = scheduleData.schedule.map((e) =>
      e.classId === editingEntry.classId &&
      e.room === editingEntry.room &&
      e.timeSlot.startTime === editingEntry.timeSlot.startTime
        ? updatedEntry
        : e
    )

    setScheduleData({
      ...scheduleData,
      schedule: updatedSchedule,
    })
    setEditingEntry(null)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : DAYS.length - 1))
    } else {
      setCurrentDayIndex((prev) => (prev < DAYS.length - 1 ? prev + 1 : 0))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className="bg-card" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        <CardHeader className="flex flex-row items-center justify-between ">
          <CardTitle className="text-xl">{currentDay}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay('prev')}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous day</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateDay('next')}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next day</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto max-h-[calc(100vh-140px)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              {/* Header row with rooms */}
              <div
                className="grid border-b border-t "
                style={{
                  gridTemplateColumns: `100px repeat(${rooms.length }, minmax(140px, 1fr))`,
                }}
              >
                <div className="sticky left-0 bg-card p-3 text-sm font-medium text-muted-foreground">
                  Time
                </div>
                {rooms.map((room) => (
                  <div
                    key={room}
                    className="border-l p-3 text-center text-sm font-medium"
                  >
                    {room}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              { /* @ts-ignore */}
              {TIME_SLOTS.map((timeSlot, timeIndex) => (
                <div
                  key={timeSlot.label}
                  className={`grid border-b ${timeIndex === 0 ? 'border-t' : ''}`}
                  style={{
                    gridTemplateColumns: `100px repeat(${rooms.length}, minmax(140px, 1fr))`,
                  }}
                >
                  {/* Time label */}
                  <div className="sticky left-0 bg-card p-2 text-xs text-muted-foreground">
                    {timeSlot.label}
                  </div>

                  {/* Room cells */}
                  {rooms.map((room) => {
                    const entry = getEntryAtPosition(room, timeSlot.start)
                    const isOccupied = isCellOccupied(room, timeSlot.start)

                    // Skip cells that are part of a multi-row entry
                    if (isOccupied && !entry) {
                      return (
                        <div
                          key={`${room}-${timeSlot.start}`}
                          className="border-l"
                        />
                      )
                    }

                    const rowSpan = entry
                      ? calculateRowSpan(
                          entry.timeSlot.startTime,
                          entry.timeSlot.endTime
                        )
                      : 1

                    return (
                      <DroppableCell
                        key={`${room}-${timeSlot.start}`}
                        id={`${room}|${timeSlot.start}`}
                        className="relative min-h-[70px] border-l p-1"
                      >
                        {entry && (
                          <DraggableCard
                            id={`${entry.classId}-${entry.room}-${entry.timeSlot.startTime}`}
                            entry={entry}
                            style={{
                              height: `calc(${rowSpan * 70}px - 8px)`,
                            }}
                          >
                            <ScheduleCard
                              entry={entry}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              isDragging={
                                activeEntry?.classId === entry.classId &&
                                activeEntry?.room === entry.room
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
        </CardContent>
      </Card>

      {/* Drag overlay */}
      <DragOverlay>
        {activeEntry && (
          <div
            className="w-[140px] opacity-80 bg-red-600"
            style={{
              height: `calc(${calculateRowSpan(activeEntry.timeSlot.startTime, activeEntry.timeSlot.endTime) * 70}px - 8px)`,
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
