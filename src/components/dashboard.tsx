import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatCards } from '@/components/stat-cards'
import { FitnessChart } from '@/components/fitness-chart'
import { RoomUtilizationChart } from '@/components/room-utilization-chart'
import { WeeklyDistributionChart } from '@/components/weekly-distribution-chart'
import { RecentActivity } from '@/components/recent-activity'
import { SchedulePreview } from '@/components/schedule-preview'
import {
  mockDashboardStats,
  mockFitnessHistory,
  mockRoomUtilization,
  mockWeeklyDistribution,
} from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Dashboard"
          description="University Course Timetabling System Overview"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-6 lg:p-8">
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Selamat Datang di UCTP
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Sistem penjadwalan kuliah terpadu dengan optimisasi cerdas. 
                  Pantau statistik, kelola jadwal, dan optimalkan alokasi sumber daya kampus.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-full opacity-10">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-primary" />
                <div className="absolute right-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary" />
              </div>
            </div>

            {/* Stats Overview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Ringkasan Sistem</h3>
                <span className="text-sm text-muted-foreground">Semester Genap 2025/2026</span>
              </div>
              <StatCards stats={mockDashboardStats} />
            </section>

            {/* Charts Row */}
            <section className="grid gap-6 lg:grid-cols-2">
              <FitnessChart data={mockFitnessHistory} />
              <RoomUtilizationChart data={mockRoomUtilization} />
            </section>

            {/* Schedule Preview */}
            <section>
              <SchedulePreview />
            </section>

            {/* Bottom Row */}
            <section className="grid gap-6 lg:grid-cols-2">
              <WeeklyDistributionChart data={mockWeeklyDistribution} />
              <RecentActivity />
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}