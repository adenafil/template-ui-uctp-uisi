import { useState } from 'react'
import { Plus, Search, Users, Pencil, Trash2, X, Clock, Calendar } from 'lucide-react'
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
import { mockLecturers, mockCourses } from '@/lib/mock-data'
import type { Lecturer, LecturerFormData } from '@/lib/types'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>(mockLecturers)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null)
  const [formData, setFormData] = useState<LecturerFormData>({
    prodi: '',
    code: '',
    name: '',
    preferredTime: '',
    researchDay: '',
    transitTime: 15,
    maxDailyPeriods: 4,
    preferredRoom: '',
  })

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingLecturer(null)
    setFormData({
      prodi: '',
      code: '',
      name: '',
      preferredTime: '',
      researchDay: '',
      transitTime: 15,
      maxDailyPeriods: 4,
      preferredRoom: '',
    })
    setIsSheetOpen(true)
  }

  const handleEdit = (lecturer: Lecturer) => {
    setEditingLecturer(lecturer)
    setFormData({
      prodi: lecturer.prodi,
      code: lecturer.code,
      name: lecturer.name,
      preferredTime: lecturer.preferredTime,
      researchDay: lecturer.researchDay,
      transitTime: lecturer.transitTime,
      maxDailyPeriods: lecturer.maxDailyPeriods,
      preferredRoom: lecturer.preferredRoom,
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (lecturerId: string) => {
    setLecturers(lecturers.filter((l) => l.id !== lecturerId))
  }

  const handleSubmit = () => {
    if (editingLecturer) {
      setLecturers(
        lecturers.map((l) =>
          l.id === editingLecturer.id
            ? { ...l, ...formData }
            : l
        )
      )
    } else {
      const newLecturer: Lecturer = {
        id: `lec-${Date.now()}`,
        ...formData,
      }
      setLecturers([...lecturers, newLecturer])
    }
    setIsSheetOpen(false)
  }

  // Get courses assigned to this lecturer
  const getAssignedCourses = (lecturerCode: string) => {
    return mockCourses.filter(
      (c) =>
        c.kodeDosen1 === lecturerCode ||
        c.kodeDosen2 === lecturerCode ||
        c.kodeDosenProdiLain1 === lecturerCode ||
        c.kodeDosenProdiLain2 === lecturerCode
    )
  }

  const isFormValid = formData.code && formData.name && formData.prodi

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Lecturers"
          description="Manage faculty members"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-2/10 border border-chart-2/20">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Faculty Members</h2>
                  <p className="text-sm text-muted-foreground">{lecturers.length} lecturers registered</p>
                </div>
              </div>
              
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-chart-2 to-chart-2/90 hover:opacity-90 shadow-lg shadow-chart-2/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Lecturer
              </Button>
            </div>

            {/* Main Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">All Lecturers</CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search lecturers..."
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
                        <TableHead className="font-semibold text-foreground">Prodi</TableHead>
                        <TableHead className="font-semibold text-foreground">Research Day</TableHead>
                        <TableHead className="font-semibold text-foreground">Max Periods</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLecturers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No lecturers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLecturers.map((lecturer) => {
                          const assignedCourses = getAssignedCourses(lecturer.code)
                          return (
                            <TableRow 
                              key={lecturer.id} 
                              className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                            >
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="font-mono font-semibold text-primary border-primary/30 bg-primary/5"
                                >
                                  {lecturer.code}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 text-chart-2 font-semibold text-sm border border-chart-2/20">
                                    {lecturer.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join('')}
                                  </div>
                                  <div>
                                    <span className="font-medium text-foreground block">{lecturer.name}</span>
                                    {assignedCourses.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {assignedCourses.length} courses assigned
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary"
                                  className="font-normal bg-secondary/60"
                                >
                                  {lecturer.prodi}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="size-3.5 text-muted-foreground" />
                                  <span className="text-sm">{lecturer.researchDay || '-'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="size-3.5 text-muted-foreground" />
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-3/10 text-chart-3">
                                    {lecturer.maxDailyPeriods} periods/day
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(lecturer)}
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
                                        <AlertDialogTitle>Delete Lecturer</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete <strong>{lecturer.name}</strong>? 
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(lecturer.id)}
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
                          )
                        })
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
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}</SheetTitle>
              <SheetDescription>
                {editingLecturer 
                  ? 'Update the lecturer details below.' 
                  : 'Fill in the details to add a new lecturer.'}
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Lecturer Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., NGT"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="prodi">Program Studi</Label>
                  <Input
                    id="prodi"
                    placeholder="e.g., INFORMATIKA"
                    value={formData.prodi}
                    onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Dr. Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="researchDay">Research Day</Label>
                <Select
                  value={formData.researchDay || "__none__"}
                  onValueChange={(value) => 
                    setFormData({ ...formData, researchDay: value === "__none__" ? "" : value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  placeholder="e.g., 08:00-16:00"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Format: 18.30 - 21.00 Thursday, 18.30 - 21.00 Friday, 07.30 - 16.20 Saturday
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="transitTime">Transit Time (minutes)</Label>
                  <Input
                    id="transitTime"
                    type="number"
                    min={0}
                    placeholder="e.g., 15"
                    value={formData.transitTime}
                    onChange={(e) => setFormData({ ...formData, transitTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="maxDailyPeriods">Max Daily Periods</Label>
                  <Input
                    id="maxDailyPeriods"
                    type="number"
                    min={1}
                    max={10}
                    placeholder="e.g., 4"
                    value={formData.maxDailyPeriods}
                    onChange={(e) => setFormData({ ...formData, maxDailyPeriods: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preferredRoom">Preferred Rooms</Label>
                <Input
                  id="preferredRoom"
                  placeholder="e.g., CM-101,CM-102"
                  value={formData.preferredRoom}
                  onChange={(e) => setFormData({ ...formData, preferredRoom: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple rooms with commas
                </p>
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
                {editingLecturer ? 'Update Lecturer' : 'Add Lecturer'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
