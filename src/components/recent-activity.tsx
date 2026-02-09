import { Calendar, Check, AlertTriangle, RefreshCw, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface ActivityItem {
  id: string
  type: 'schedule' | 'optimization' | 'conflict' | 'add' | 'update'
  message: string
  timestamp: string
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'optimization',
    message: 'Optimization completed with 87% fitness score',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'conflict',
    message: 'Room conflict detected: LT-101 on Monday 10:00',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    type: 'add',
    message: 'New course added: CS401 Machine Learning',
    timestamp: '5 hours ago',
  },
  {
    id: '4',
    type: 'schedule',
    message: 'Schedule entry updated for CS201 Data Structures',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    type: 'update',
    message: 'Room capacity updated for Lab-A1',
    timestamp: '2 days ago',
  },
  {
    id: '6',
    type: 'optimization',
    message: 'Started new optimization run with 500 generations',
    timestamp: '2 days ago',
  },
]

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'schedule':
      return <Calendar className="size-4 text-chart-1" />
    case 'optimization':
      return <RefreshCw className="size-4 text-chart-2" />
    case 'conflict':
      return <AlertTriangle className="size-4 text-chart-4" />
    case 'add':
      return <Plus className="size-4 text-success" />
    case 'update':
      return <Check className="size-4 text-chart-3" />
  }
}

interface RecentActivityProps {
  maxItems?: number
  variant?: 'card' | 'dropdown'
}

export function RecentActivity({ maxItems, variant = 'card' }: RecentActivityProps) {
  const activities = maxItems ? mockActivities.slice(0, maxItems) : mockActivities

  const content = (
    <div className="space-y-3 sm:space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
          <div className="mt-0.5 flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm leading-snug break-words">{activity.message}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  if (variant === 'dropdown') {
    return (
      <div className="py-2">
        <ScrollArea className="h-[320px]">
          <div className="px-2">
            {content}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base sm:text-lg truncate">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ScrollArea className="h-[250px] sm:h-[300px] pr-2 sm:pr-4">
          {content}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
