import { useState } from 'react'
import { Plus, Search, Building2, Users, Pencil, Trash2, X, Upload, Download } from 'lucide-react'
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
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { ExcelImportDialog } from '@/components/excel-import-dialog'
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

const roomRequiredFields = [
  { name: 'code', description: 'Room code/identifier', example: 'CM-101' },
  { name: 'name', description: 'Room name', example: 'Cendekia Merdeka 101' },
  { name: 'type', description: 'Room type', example: 'theory or lab_multimedia' },
  { name: 'capacity', description: 'Room capacity', example: '40' },
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
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

  const handleBulkDelete = (ids: string[]) => {
    setRooms(rooms.filter((r) => !ids.includes(r.id)))
  }

  const roomColumns: DataTableColumn<Room>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (room) => (
        <Badge
          variant="outline"
          className="font-mono font-semibold text-primary border-primary/30 bg-primary/5"
        >
          {room.code}
        </Badge>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      cell: (room) => <span className="font-medium text-foreground">{room.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      cell: (room) => (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${getRoomTypeColor(room.type)}`}
        >
          {getRoomTypeLabel(room.type)}
        </Badge>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (room) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-muted">
            <Users className="size-3.5 text-muted-foreground" />
          </div>
          <span className="font-medium">{room.capacity}</span>
          <span className="text-muted-foreground text-sm">seats</span>
        </div>
      ),
    },
  ]

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

  const handleImport = (file: File, overwrite: boolean) => {
    // TODO: Implement API call to import rooms from Excel
    console.log('Importing rooms from:', file.name, 'Overwrite:', overwrite)
    // Simulasi berhasil
    setIsImportDialogOpen(false)
  }

  const handleDownloadTemplate = () => {
    // TODO: Implement API call to download template
    console.log('Downloading rooms template')
  }

  const handleExport = () => {
    // TODO: Implement API call to export rooms to Excel
    console.log('Exporting rooms to Excel')
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
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsImportDialogOpen(true)}
                  className="border-chart-2/30 text-chart-2 "
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleExport}
                  className="border-chart-4/30 text-chart-4 "
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-chart-3 to-chart-3/90 hover:opacity-90 shadow-lg shadow-chart-3/20"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </div>
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
                <DataTable
                  data={filteredRooms}
                  columns={roomColumns}
                  onDeleteItems={handleBulkDelete}
                  defaultRowsPerPage={25}
                  rowActions={(room) => (
                    <>
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
                    </>
                  )}
                />
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

        {/* Import Excel Dialog */}
        <ExcelImportDialog
          isOpen={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Rooms from Excel"
          description="Import classroom and facility data from an Excel file. Make sure your file includes all required fields."
          requiredFields={roomRequiredFields}
          sheetName="Rooms"
          onImport={handleImport}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
