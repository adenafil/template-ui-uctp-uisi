'use client'

import {
  AreaChart,
  Area,
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
            <AreaChart data={sampledData}>
              <defs>
                <linearGradient id="fillCurrentCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillBestCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
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
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
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
              <Area
                type="monotone"
                dataKey="currentCost"
                stroke="var(--color-chart-2)"
                fill="url(#fillCurrentCost)"
                strokeWidth={1.5}
                dot={false}
                name="currentCost"
              />
              <Area
                type="monotone"
                dataKey="bestCost"
                stroke="var(--color-chart-1)"
                fill="url(#fillBestCost)"
                strokeWidth={2}
                dot={false}
                name="bestCost"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
