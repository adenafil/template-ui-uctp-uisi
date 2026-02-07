'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OptimizationHistoryPoint } from '@/lib/optimization-types'

interface SACostChartProps {
  data: OptimizationHistoryPoint[]
  title?: string
}

export function SACostChart({ data, title = 'Cost Convergence' }: SACostChartProps) {
  // Sample data for better performance
  const sampledData = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 100)) === 0)

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampledData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="iteration"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => [
                  value.toFixed(0),
                  name === 'currentCost' ? 'Current Cost' : 'Best Cost'
                ]}
                labelFormatter={(label) => `Iteration: ${label}`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => value === 'currentCost' ? 'Current Cost' : 'Best Cost'}
              />
              <Line
                type="monotone"
                dataKey="currentCost"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1.5}
                dot={false}
                name="currentCost"
              />
              <Line
                type="monotone"
                dataKey="bestCost"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                name="bestCost"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
