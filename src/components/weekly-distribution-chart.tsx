'use client'

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface WeeklyDistributionChartProps {
  data: Array<{
    day: string
    sessions: number
    hours: number
  }>
}

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: 'var(--color-chart-1)',
  },
  hours: {
    label: 'Hours',
    color: 'var(--color-chart-2)',
  },
}

export function WeeklyDistributionChart({ data }: WeeklyDistributionChartProps) {
  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate">Weekly Distribution</span>
          <div className="flex items-center gap-2 text-[10px] sm:gap-4 sm:text-sm font-normal shrink-0">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span className="size-2 sm:size-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Sessions</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span className="size-2 sm:size-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Hours</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="sessions"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="hours"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
