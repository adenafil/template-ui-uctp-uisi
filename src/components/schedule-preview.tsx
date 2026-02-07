'use client'

import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockScheduleEntries, mockCourses, mockRooms } from '@/lib/mock-data'
import { Link } from '@tanstack/react-router'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00']

export function SchedulePreview() {
  const getCourseAtSlot = (day: string, time: string) => {
    const entry = mockScheduleEntries.find(
      (e) =>
        e.timeSlot.day === day &&
        e.timeSlot.startTime <= time &&
        e.timeSlot.endTime > time
    )
    if (!entry) return null
    const course = mockCourses.find((c) => c.id === entry.courseId)
    const room = mockRooms.find((r) => r.id === entry.roomId)
    return { entry, course, room }
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Computer Science':
        return 'bg-chart-1/20 text-chart-1 border-chart-1/30'
      case 'Mathematics':
        return 'bg-chart-2/20 text-chart-2 border-chart-2/30'
      case 'Physics':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30'
      case 'Engineering':
        return 'bg-chart-4/20 text-chart-4 border-chart-4/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Schedule Preview</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            View Full Schedule
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 gap-1">
              {/* Header */}
              <div className="p-2 text-xs font-medium text-muted-foreground">
                Time
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day.slice(0, 3)}
                </div>
              ))}

              {/* Time slots */}
              {TIME_SLOTS.map((time) => (
                <div key={`row-${time}`} className="contents">
                  <div className="flex items-center p-2 text-xs text-muted-foreground">
                    {time}
                  </div>
                  {DAYS.map((day) => {
                    const slot = getCourseAtSlot(day, time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className="min-h-[40px] rounded-md border border-border/50 p-1"
                      >
                        {slot && (
                          <div
                            className={`h-full rounded px-1.5 py-1 text-xs ${getDepartmentColor(slot.course?.department || '')}`}
                          >
                            <div className="font-medium truncate">
                              {slot.course?.code}
                            </div>
                            <div className="text-[10px] opacity-80 truncate">
                              {slot.room?.name}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
            Computer Science
          </Badge>
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">
            Mathematics
          </Badge>
          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/30">
            Physics
          </Badge>
          <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30">
            Engineering
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
