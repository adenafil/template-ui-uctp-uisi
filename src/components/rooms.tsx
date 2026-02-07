import { Plus, Search, Users, Monitor, Wifi, Mic } from 'lucide-react'
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
      return <Monitor className="size-3.5" />
    case 'computers':
      return <Monitor className="size-3.5" />
    case 'network':
      return <Wifi className="size-3.5" />
    case 'microphone':
      return <Mic className="size-3.5" />
    default:
      return null
  }
}

export default function RoomsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Rooms"
          description="Manage classrooms and facilities"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>All Rooms</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search rooms..."
                      className="h-9 w-64 bg-muted/50 pl-9"
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Room
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Room</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Equipment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRooms.map((room) => (
                      <TableRow key={room.id} className="border-border">
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {room.building}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              room.type === 'lecture'
                                ? 'bg-chart-1/10 text-chart-1 border-chart-1/30'
                                : room.type === 'lab'
                                  ? 'bg-chart-2/10 text-chart-2 border-chart-2/30'
                                  : 'bg-chart-3/10 text-chart-3 border-chart-3/30'
                            }
                          >
                            {room.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 text-muted-foreground" />
                            {room.capacity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {room.equipment.map((eq) => (
                              <Badge
                                key={eq}
                                variant="secondary"
                                className="gap-1 text-xs"
                              >
                                {getEquipmentIcon(eq)}
                                {eq}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
