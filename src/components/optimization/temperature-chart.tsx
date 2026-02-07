'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OptimizationHistoryPoint } from '@/lib/optimization-types'

interface TemperatureChartProps {
  data: OptimizationHistoryPoint[]
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Sample data for better performance
  const sampledData = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 100)) === 0)

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Temperature Decay</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampledData}>
              <defs>
                <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="iteration"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                tickLine={{ stroke: 'var(--color-border)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                tickLine={{ stroke: 'var(--color-border)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                  if (value >= 1) return value.toFixed(0)
                  return value.toExponential(0)
                }}
                scale="log"
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                formatter={(value: number) => [value.toExponential(2), 'Temperature']}
                labelFormatter={(label) => `Iteration: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-chart-4)"
                fill="url(#fillTemperature)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
