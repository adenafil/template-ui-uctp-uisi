'use client'

import {
  BookOpen,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/lib/types'

interface StatCardsProps {
  stats: DashboardStats
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      description: 'Active courses this semester',
      trend: '+2 from last semester',
      color: 'text-chart-1',
    },
    {
      title: 'Lecturers',
      value: stats.totalLecturers,
      icon: Users,
      description: 'Faculty members assigned',
      trend: 'Fully staffed',
      color: 'text-chart-2',
    },
    {
      title: 'Rooms',
      value: stats.totalRooms,
      icon: Building2,
      description: 'Available classrooms',
      trend: `${Math.round(stats.utilizationRate * 100)}% utilization`,
      color: 'text-chart-3',
    },
    {
      title: 'Scheduled Sessions',
      value: stats.scheduledSessions,
      icon: Calendar,
      description: 'Weekly class sessions',
      trend: 'All sessions assigned',
      color: 'text-chart-1',
    },
    {
      title: 'Conflicts',
      value: stats.conflictCount,
      icon: AlertTriangle,
      description: 'Schedule conflicts detected',
      trend: stats.conflictCount > 0 ? 'Needs attention' : 'No conflicts',
      color: stats.conflictCount > 0 ? 'text-chart-4' : 'text-success',
    },
    {
      title: 'Fitness Score',
      value: `${Math.round(stats.lastOptimizationFitness * 100)}%`,
      icon: TrendingUp,
      description: 'Optimization quality',
      trend: 'Last optimization result',
      color: 'text-chart-1',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`size-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
