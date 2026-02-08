import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { ScheduleGridWrapper } from '@/components/schedule/schedule-grid-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Info, Maximize, Minimize } from 'lucide-react'

export default function SchedulePage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const timetableRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await timetableRef.current?.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.7))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Schedule"
          description="Drag and drop to reschedule courses"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-full space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-4/10 border border-chart-4/20">
                  <Calendar className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
                  <p className="text-sm text-muted-foreground">Semester Genap 2025/2026</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  Validated
                </Badge>
              </div>
            </div>

            {/* Info Banner */}
            <Card className="border-border/60 bg-muted/30">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10 mt-0.5">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Tip:</span> Drag and drop course cards to reschedule. 
                      Click on any card to edit details. The system will automatically check for conflicts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Grid */}
            <div 
              ref={timetableRef} 
              className={`relative ${isFullscreen ? 'h-screen w-screen overflow-auto bg-background p-6' : ''}`}
            >
              <Card className={`border-border/60 shadow-sm ${isFullscreen ? 'min-h-full' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-lg">Timetable View</CardTitle>
                      {isFullscreen && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomOut}
                            className="h-7 px-2 text-xs"
                          >
                            −
                          </Button>
                          <span className="text-xs text-muted-foreground min-w-[50px] text-center">
                            {Math.round(zoomLevel * 100)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomIn}
                            className="h-7 px-2 text-xs"
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetZoom}
                            className="h-7 px-2 text-xs"
                          >
                            Reset
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="gap-2"
                      >
                        {isFullscreen ? (
                          <>
                            <Minimize className="h-4 w-4" />
                            Exit Full Screen
                          </>
                        ) : (
                          <>
                            <Maximize className="h-4 w-4" />
                            Full Screen
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScheduleGridWrapper zoomLevel={zoomLevel} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}