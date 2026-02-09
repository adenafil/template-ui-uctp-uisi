'use client'

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface RoomUtilizationChartProps {
  data: Array<{
    name: string
    utilization: number
    capacity: number
  }>
}

const chartConfig = {
  utilization: {
    label: 'Utilization',
    color: 'var(--color-chart-1)',
  },
}

export function RoomUtilizationChart({ data }: RoomUtilizationChartProps) {
  const avgUtilization = Math.round(data.reduce((a, b) => a + b.utilization, 0) / data.length)
  
  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate">Room Utilization</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground whitespace-nowrap">
            Avg: {avgUtilization}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.slice(0, 5)}
              layout="vertical"
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={70}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                  // @ts-ignore
                    formatter={(value, name, props) => [
                      `${Math.round(Number(value))}%`,
                      `Utilization (Capacity: ${props.payload.capacity})`,
                    ]}
                  />
                }
              />
              <Bar
                dataKey="utilization"
                fill="var(--color-chart-1)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
