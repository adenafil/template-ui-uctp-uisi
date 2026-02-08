import Timetable from '@/components/timetable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timetable')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Timetable />
}
