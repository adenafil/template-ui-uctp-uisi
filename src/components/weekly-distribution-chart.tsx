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
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Distribution</span>
          <div className="flex items-center gap-4 text-sm font-normal">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Sessions</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-chart-2" />
              <span className="text-muted-foreground">Hours</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
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
