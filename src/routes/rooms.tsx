import RoomsPage from '@/components/rooms'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RoomsPage />
}
