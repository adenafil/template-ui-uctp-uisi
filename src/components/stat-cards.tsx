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
      bgColor: 'bg-chart-1/10',
      borderColor: 'border-chart-1/20',
    },
    {
      title: 'Lecturers',
      value: stats.totalLecturers,
      icon: Users,
      description: 'Faculty members assigned',
      trend: 'Fully staffed',
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      borderColor: 'border-chart-2/20',
    },
    {
      title: 'Rooms',
      value: stats.totalRooms,
      icon: Building2,
      description: 'Available classrooms',
      trend: `${Math.round(stats.utilizationRate * 100)}% utilization`,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      borderColor: 'border-chart-3/20',
    },
    {
      title: 'Scheduled Sessions',
      value: stats.scheduledSessions,
      icon: Calendar,
      description: 'Weekly class sessions',
      trend: 'All sessions assigned',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      borderColor: 'border-chart-4/20',
    },
    {
      title: 'Conflicts',
      value: stats.conflictCount,
      icon: AlertTriangle,
      description: 'Schedule conflicts detected',
      trend: stats.conflictCount > 0 ? 'Needs attention' : 'No conflicts',
      color: stats.conflictCount > 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400',
      bgColor: stats.conflictCount > 0 ? 'bg-destructive/10' : 'bg-emerald-500/10',
      borderColor: stats.conflictCount > 0 ? 'border-destructive/20' : 'border-emerald-500/20',
    },
    {
      title: 'Fitness Score',
      value: `${Math.round(stats.lastOptimizationFitness * 100)}%`,
      icon: TrendingUp,
      description: 'Optimization quality',
      trend: 'Last optimization result',
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
      borderColor: 'border-chart-5/20',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className="group bg-card border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor} ${card.borderColor} border group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}