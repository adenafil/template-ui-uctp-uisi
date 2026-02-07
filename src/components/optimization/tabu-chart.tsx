'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OptimizationHistoryPoint } from '@/lib/optimization-types'

interface TabuChartProps {
  data: OptimizationHistoryPoint[]
}

export function TabuChart({ data }: TabuChartProps) {
  // Sample data for better performance
  const sampledData = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 100)) === 0)

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tabu List Size</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampledData}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                formatter={(value: number) => [value, 'Tabu List Size']}
                labelFormatter={(label) => `Iteration: ${label}`}
              />
              <Line
                type="stepAfter"
                dataKey="tabuListSize"
                stroke="var(--color-chart-5)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
