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
    iteration: number
    currentCost: number
    bestCost: number
  }>
}

const chartConfig = {
  bestCost: {
    label: 'Best Cost',
    color: 'var(--color-chart-1)',
  },
  currentCost: {
    label: 'Current Cost',
    color: 'var(--color-chart-2)',
  },
}

export function FitnessChart({ data }: FitnessChartProps) {
  const lastData = data[data.length - 1]
  const bestCost = lastData?.bestCost ?? 0
  
  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="truncate">Optimization Progress</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground whitespace-nowrap">
            Best: {bestCost.toFixed(0)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
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
                <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="iteration"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Iteration: ${value}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="currentCost"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                fill="url(#fillCurrent)"
              />
              <Area
                type="monotone"
                dataKey="bestCost"
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
