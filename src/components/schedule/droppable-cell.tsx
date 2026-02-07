import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface DroppableCellProps {
  id: string
  children?: ReactNode
  className?: string
}

export function DroppableCell({ id, children, className }: DroppableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && 'bg-primary/10 ring-2 ring-primary/50 ring-inset'
      )}
    >
      {children}
    </div>
  )
}
