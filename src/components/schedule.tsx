import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { ScheduleGridWrapper } from '@/components/schedule/schedule-grid-wrapper'

export default function SchedulePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Schedule"
          description="Drag and drop to reschedule courses"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-full">
            <ScheduleGridWrapper />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
