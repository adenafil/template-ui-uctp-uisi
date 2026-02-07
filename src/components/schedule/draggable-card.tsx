'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { ScheduleEntry } from '@/lib/schedule-types'
import type { CSSProperties, ReactNode } from 'react'

interface DraggableCardProps {
  id: string
  entry: ScheduleEntry
  children: ReactNode
  style?: CSSProperties
}

export function DraggableCard({ id, children, style }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const dragStyle: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    ...style,
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}
