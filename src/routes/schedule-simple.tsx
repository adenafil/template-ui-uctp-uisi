import { ScheduleSimple } from '@/components/schedule-simple'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule-simple')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ScheduleSimple />
}
