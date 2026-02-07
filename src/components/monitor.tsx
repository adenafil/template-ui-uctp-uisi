import { Activity, Clock, Cpu, HardDrive } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function MonitorPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Monitor"
          description="System performance and optimization monitoring"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CPU Usage
                  </CardTitle>
                  <Cpu className="size-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <Progress value={24} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Memory
                  </CardTitle>
                  <HardDrive className="size-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">512 MB</div>
                  <Progress value={32} className="mt-2 h-1.5" />
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Uptime
                  </CardTitle>
                  <Clock className="size-4 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4h 32m</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Since last restart
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status
                  </CardTitle>
                  <Activity className="size-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">Healthy</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Optimization History */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Optimization History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      date: 'Jan 28, 2025 14:32',
                      generations: 500,
                      fitness: 0.87,
                      duration: '12m 34s',
                    },
                    {
                      id: 2,
                      date: 'Jan 27, 2025 09:15',
                      generations: 300,
                      fitness: 0.82,
                      duration: '7m 21s',
                    },
                    {
                      id: 3,
                      date: 'Jan 25, 2025 16:45',
                      generations: 500,
                      fitness: 0.79,
                      duration: '11m 58s',
                    },
                    {
                      id: 4,
                      date: 'Jan 24, 2025 11:20',
                      generations: 200,
                      fitness: 0.71,
                      duration: '4m 45s',
                    },
                  ].map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{run.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {run.generations} generations - {run.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-chart-1">
                          {Math.round(run.fitness * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fitness Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
