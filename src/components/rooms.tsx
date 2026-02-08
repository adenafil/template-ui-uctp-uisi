import { useState } from 'react'
import { Plus, Search, Building2, Users, Pencil, Trash2, X } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { mockRooms } from '@/lib/mock-data'
import type { Room, RoomFormData } from '@/lib/types'

const getRoomTypeColor = (type: string) => {
  switch (type) {
    case 'theory':
      return 'bg-chart-1/10 text-chart-1 border-chart-1/30'
    case 'lab_multimedia':
      return 'bg-chart-2/10 text-chart-2 border-chart-2/30'
    default:
      return 'bg-muted text-muted-foreground border-muted'
  }
}

const getRoomTypeLabel = (type: string) => {
  switch (type) {
    case 'theory':
      return 'Theory'
    case 'lab_multimedia':
      return 'Lab Multimedia'
    default:
      return type
  }
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [formData, setFormData] = useState<RoomFormData>({
    code: '',
    name: '',
    type: 'theory',
    capacity: 40,
  })

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingRoom(null)
    setFormData({
      code: '',
      name: '',
      type: 'theory',
      capacity: 40,
    })
    setIsSheetOpen(true)
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setFormData({
      code: room.code,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (roomId: string) => {
    setRooms(rooms.filter((r) => r.id !== roomId))
  }

  const handleSubmit = () => {
    if (editingRoom) {
      // Update existing room
      setRooms(
        rooms.map((r) =>
          r.id === editingRoom.id
            ? { ...r, ...formData }
            : r
        )
      )
    } else {
      // Add new room
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        ...formData,
      }
      setRooms([...rooms, newRoom])
    }
    setIsSheetOpen(false)
  }

  const isFormValid = formData.code && formData.name && formData.capacity > 0

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
                  <p className="text-sm text-muted-foreground">{rooms.length} rooms available</p>
                </div>
              </div>
              
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-chart-3 to-chart-3/90 hover:opacity-90 shadow-lg shadow-chart-3/20"
              >
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                        <TableHead className="font-semibold text-foreground">Code</TableHead>
                        <TableHead className="font-semibold text-foreground">Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Type</TableHead>
                        <TableHead className="font-semibold text-foreground">Capacity</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRooms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No rooms found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRooms.map((room) => (
                          <TableRow 
                            key={room.id} 
                            className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                          >
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="font-mono font-semibold text-primary border-primary/30 bg-primary/5"
                              >
                                {room.code}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                              {room.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`capitalize font-medium ${getRoomTypeColor(room.type)}`}
                              >
                                {getRoomTypeLabel(room.type)}
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
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(room)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Room</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete <strong>{room.name}</strong>? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(room.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Add/Edit Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader className="">
              <SheetTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</SheetTitle>
              <SheetDescription>
                {editingRoom 
                  ? 'Update the room details below.' 
                  : 'Fill in the details to add a new room.'}
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Room Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CM-101"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Cendekia Merdeka 101"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'theory' | 'lab_multimedia') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="lab_multimedia">Lab Multimedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  placeholder="e.g., 40"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <SheetFooter className="flex-col sm:flex-row gap-2">
              <SheetClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingRoom ? 'Update Room' : 'Add Room'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
