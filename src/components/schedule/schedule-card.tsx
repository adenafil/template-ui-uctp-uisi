'use client'

import { MoreVertical, Clock, Users, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { ScheduleEntry } from '@/lib/schedule-types'
import { getProdiColor, hasOverlapWithPrayerTime } from '@/lib/schedule-types'
import { cn } from '@/lib/utils'

interface ScheduleCardProps {
  entry: ScheduleEntry
  onEdit: (entry: ScheduleEntry) => void
  onDelete: (entry: ScheduleEntry) => void
  isDragging?: boolean
}

export function ScheduleCard({ entry, onEdit, onDelete, isDragging }: ScheduleCardProps) {
  const colors = getProdiColor(entry.prodi)
  const hasOverlap = hasOverlapWithPrayerTime(entry.timeSlot.startTime, entry.timeSlot.endTime)

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-md border-l-4 bg-card p-2 transition-all',
        colors.border,
        colors.bg,
        isDragging && 'opacity-50 ring-2 ring-primary',
        'hover:shadow-md'
      )}
    >
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-1">
        <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {entry.className}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(entry)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(entry)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Class ID and Class */}
      <p className="mt-0.5 text-xs text-muted-foreground">
        {entry.classId} • {entry.class}
      </p>

      {/* Time and SKS */}
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>
          {entry.timeSlot.startTime}-{entry.timeSlot.endTime} • {entry.sks}SKS
        </span>
      </div>

      {/* Lecturer */}
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>{entry.lecturers.join(', ')}</span>
      </div>

      {/* Participants badge */}
      <div className="mt-auto pt-2">
        <Badge variant="secondary" className="text-xs">
          {entry.participants} peserta
        </Badge>
      </div>

      {/* Prayer time overlap warning */}
      {hasOverlap && (
        <div className="mt-1 flex items-center gap-1 text-xs text-warning">
          <AlertTriangle className="h-3 w-3" />
          <span className="truncate">Overlaps with dzuhur pray...</span>
        </div>
      )}
    </div>
  )
}
