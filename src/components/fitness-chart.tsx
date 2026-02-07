'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface FitnessChartProps {
  data: Array<{
    generation: number
    best: number
    average: number
  }>
}

const chartConfig = {
  best: {
    label: 'Best Fitness',
    color: 'var(--color-chart-1)',
  },
  average: {
    label: 'Average Fitness',
    color: 'var(--color-chart-2)',
  },
}

export function FitnessChart({ data }: FitnessChartProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Optimization Progress</span>
          <span className="text-sm font-normal text-muted-foreground">
            Best: {Math.round((data[data.length - 1]?.best || 0) * 100)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBest" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-chart-2)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="generation"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `Gen ${value}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
                domain={[0, 1]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Generation ${value}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="average"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#fillAverage)"
              />
              <Area
                type="monotone"
                dataKey="best"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#fillBest)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
