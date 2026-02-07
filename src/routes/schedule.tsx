import SchedulePage from '@/components/schedule'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/schedule')({
  component: RouteComponent,
  ssr: false,
  
})

function RouteComponent() {
  return <ClientOnly fallback={<div>Loading...</div>}>
    <SchedulePage />
  </ClientOnly>
}
