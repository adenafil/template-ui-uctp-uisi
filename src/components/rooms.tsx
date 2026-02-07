import { Plus, Search, Building2, Users, Monitor, Wifi, Mic, Projector } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockRooms } from '@/lib/mock-data'

const getEquipmentIcon = (equipment: string) => {
  switch (equipment) {
    case 'projector':
      return <Projector className="size-3" />
    case 'computers':
      return <Monitor className="size-3" />
    case 'network':
      return <Wifi className="size-3" />
    case 'microphone':
      return <Mic className="size-3" />
    default:
      return null
  }
}

const getRoomTypeColor = (type: string) => {
  switch (type) {
    case 'lecture':
      return 'bg-chart-1/10 text-chart-1 border-chart-1/30'
    case 'lab':
      return 'bg-chart-2/10 text-chart-2 border-chart-2/30'
    case 'seminar':
      return 'bg-chart-4/10 text-chart-4 border-chart-4/30'
    default:
      return 'bg-muted text-muted-foreground border-muted'
  }
}

export default function RoomsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Rooms"
          description="Manage classrooms and facilities"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-3/10 border border-chart-3/20">
                  <Building2 className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Classrooms & Facilities</h2>
                  <p className="text-sm text-muted-foreground">{mockRooms.length} rooms available</p>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-chart-3 to-chart-3/90 hover:opacity-90 shadow-lg shadow-chart-3/20">
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </div>

            {/* Main Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">All Rooms</CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search rooms..."
                      className="pl-10 bg-secondary/50 border-border/60 focus:bg-background"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold text-foreground">Room</TableHead>
                        <TableHead className="font-semibold text-foreground">Building</TableHead>
                        <TableHead className="font-semibold text-foreground">Type</TableHead>
                        <TableHead className="font-semibold text-foreground">Capacity</TableHead>
                        <TableHead className="font-semibold text-foreground">Equipment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRooms.map((room) => (
                        <TableRow 
                          key={room.id} 
                          className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-foreground">
                            {room.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {room.building}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize font-medium ${getRoomTypeColor(room.type)}`}
                            >
                              {room.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-muted">
                                <Users className="size-3.5 text-muted-foreground" />
                              </div>
                              <span className="font-medium">{room.capacity}</span>
                              <span className="text-muted-foreground text-sm">seats</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {room.equipment.length > 0 ? (
                                room.equipment.map((eq) => (
                                  <Badge
                                    key={eq}
                                    variant="secondary"
                                    className="gap-1.5 text-xs capitalize bg-secondary/60 hover:bg-secondary transition-colors"
                                  >
                                    {getEquipmentIcon(eq)}
                                    {eq}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground italic">No equipment</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}