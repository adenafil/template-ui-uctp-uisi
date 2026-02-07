import SchedulePage from '@/components/schedule'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SchedulePage />
}
