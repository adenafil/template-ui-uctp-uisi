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

interface ViolationsChartProps {
  data: OptimizationHistoryPoint[]
}

export function ViolationsChart({ data }: ViolationsChartProps) {
  // Sample data for better performance
  const sampledData = data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 100)) === 0)

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Constraint Violations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampledData}>
              <defs>
                <linearGradient id="fillHard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillSoft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                labelFormatter={(label) => `Iteration: ${label}`}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="hardViolations"
                name="Hard Violations"
                stroke="var(--color-destructive)"
                fill="url(#fillHard)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="softViolations"
                name="Soft Violations"
                stroke="var(--color-chart-3)"
                fill="url(#fillSoft)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
