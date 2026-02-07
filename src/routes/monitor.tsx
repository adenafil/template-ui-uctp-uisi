import MonitorPage from '@/components/monitor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monitor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MonitorPage />
}
