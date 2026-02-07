import { Activity, Clock, Cpu, HardDrive, Zap, TrendingUp, Calendar } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function MonitorPage() {
  const optimizationHistory = [
    {
      id: 1,
      date: 'Jan 28, 2025 14:32',
      generations: 500,
      fitness: 0.87,
      duration: '12m 34s',
      status: 'success',
    },
    {
      id: 2,
      date: 'Jan 27, 2025 09:15',
      generations: 300,
      fitness: 0.82,
      duration: '7m 21s',
      status: 'success',
    },
    {
      id: 3,
      date: 'Jan 25, 2025 16:45',
      generations: 500,
      fitness: 0.79,
      duration: '11m 58s',
      status: 'success',
    },
    {
      id: 4,
      date: 'Jan 24, 2025 11:20',
      generations: 200,
      fitness: 0.71,
      duration: '4m 45s',
      status: 'warning',
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Monitor"
          description="System performance and optimization monitoring"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* System Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CPU Usage
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                    <Cpu className="size-4 text-chart-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">24%</div>
                  <Progress value={24} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">Normal usage</p>
                </CardContent>
              </Card>

              <Card className="group border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Memory
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                    <HardDrive className="size-4 text-chart-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">512 MB</div>
                  <Progress value={32} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">32% of 1.6 GB</p>
                </CardContent>
              </Card>

              <Card className="group border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Uptime
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
                    <Clock className="size-4 text-chart-3" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">4h 32m</div>
                  <p className="mt-3 text-xs text-muted-foreground">Since last restart</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Running</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-border/60 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Activity className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Healthy</div>
                  <p className="mt-3 text-xs text-muted-foreground">All systems operational</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-chart-4/10 border border-chart-4/20">
                      <Zap className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle>Performance Metrics</CardTitle>
                      <p className="text-sm text-muted-foreground">System performance over time</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Average Response Time', value: 45, unit: 'ms', color: 'bg-chart-1' },
                      { label: 'Database Queries/sec', value: 120, unit: 'qps', color: 'bg-chart-2' },
                      { label: 'Active Connections', value: 8, unit: 'users', color: 'bg-chart-3' },
                      { label: 'Cache Hit Rate', value: 94, unit: '%', color: 'bg-chart-4' },
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="text-sm font-medium text-foreground">
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                            style={{ width: `${Math.min(metric.value, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optimization History */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-chart-5/10 border border-chart-5/20">
                      <TrendingUp className="h-5 w-5 text-chart-5" />
                    </div>
                    <div>
                      <CardTitle>Optimization History</CardTitle>
                      <p className="text-sm text-muted-foreground">Recent optimization runs</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {optimizationHistory.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            run.status === 'success' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            <Calendar className="size-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">{run.date}</div>
                            <div className="text-xs text-muted-foreground">
                              {run.generations.toLocaleString()} iterations • {run.duration}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            run.fitness >= 0.85 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : run.fitness >= 0.75 
                                ? 'text-chart-5' 
                                : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {Math.round(run.fitness * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Fitness Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}