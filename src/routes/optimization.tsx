import OptimizationPage from '@/components/optimization'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/optimization')({
  component: RouteComponent,
})

function RouteComponent() {
  return <OptimizationPage />
}
