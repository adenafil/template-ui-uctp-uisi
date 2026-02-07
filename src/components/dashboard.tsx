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
      <SidebarInset>
        <DashboardHeader
          title="Dashboard"
          description="University Course Timetabling System Overview"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Stats Overview */}
            <StatCards stats={mockDashboardStats} />

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <FitnessChart data={mockFitnessHistory} />
              <RoomUtilizationChart data={mockRoomUtilization} />
            </div>

            {/* Schedule Preview */}
            <SchedulePreview />

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <WeeklyDistributionChart data={mockWeeklyDistribution} />
              <RecentActivity />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
