'use client'

import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  Calendar,
  Settings,
  Activity,
  Sparkles,
  FileSearch,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  heading: string
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    heading: 'Main Navigation',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Schedule', href: '/schedule', icon: Calendar },
      { title: 'Schedule Simple', href: '/schedule-simple', icon: Calendar },
      { title: 'Optimization', href: '/optimization', icon: Sparkles },
    ],
  },
  {
    heading: 'Master Data',
    items: [
      { title: 'Courses', href: '/courses', icon: BookOpen },
      { title: 'Lecturers', href: '/lecturers', icon: Users },
      { title: 'Rooms', href: '/rooms', icon: Building2 },
    ],
  },
  {
    heading: 'System',
    items: [
      { title: 'Monitor', href: '/monitor', icon: Activity },
      { title: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()

  const handleSelect = (href: string) => {
    onOpenChange(false)
    navigate({ to: href })
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Type to search navigation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navigationGroups.map((group, index) => (
            <React.Fragment key={group.heading}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return { open, setOpen }
}

export function CommandPaletteTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground outline-none ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:w-64"
    >
      <span className="flex items-center gap-2">
        <FileSearch className="h-4 w-4 text-muted-foreground" />
        <span>Search...</span>
      </span>
      <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:text-black md:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  )
}
