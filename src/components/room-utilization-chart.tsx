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
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Room Utilization</span>
          <span className="text-sm font-normal text-muted-foreground">
            Avg:{' '}
            {Math.round(data.reduce((a, b) => a + b.utilization, 0) / data.length)}
            %
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
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
