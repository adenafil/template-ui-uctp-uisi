import LecturersPage from '@/components/lecturers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lecturers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LecturersPage />
}
