import { useState } from 'react'
import { Plus, Search, BookOpen, Pencil, Trash2, X, Users, GraduationCap } from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
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
import { mockCourses, mockLecturers } from '@/lib/mock-data'
import type { Course, CourseFormData } from '@/lib/types'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState<CourseFormData>({
    prodi: '',
    kelas: '',
    kodeMatakuliah: '',
    mataKuliah: '',
    sks: 3,
    jenis: 'wajib',
    peserta: 30,
    kodeDosen1: '',
    kodeDosen2: '',
    kodeDosenProdiLain1: '',
    kodeDosenProdiLain2: '',
    classType: 'pagi',
    shouldOnTheLab: false,
    rooms: '',
  })

  const filteredCourses = courses.filter(
    (course) =>
      course.mataKuliah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.kodeMatakuliah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCourse(null)
    setFormData({
      prodi: '',
      kelas: '',
      kodeMatakuliah: '',
      mataKuliah: '',
      sks: 3,
      jenis: 'wajib',
      peserta: 30,
      kodeDosen1: '',
      kodeDosen2: '',
      kodeDosenProdiLain1: '',
      kodeDosenProdiLain2: '',
      classType: 'pagi',
      shouldOnTheLab: false,
      rooms: '',
    })
    setIsSheetOpen(true)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      prodi: course.prodi,
      kelas: course.kelas,
      kodeMatakuliah: course.kodeMatakuliah,
      mataKuliah: course.mataKuliah,
      sks: course.sks,
      jenis: course.jenis,
      peserta: course.peserta,
      kodeDosen1: course.kodeDosen1,
      kodeDosen2: course.kodeDosen2,
      kodeDosenProdiLain1: course.kodeDosenProdiLain1,
      kodeDosenProdiLain2: course.kodeDosenProdiLain2,
      classType: course.classType,
      shouldOnTheLab: course.shouldOnTheLab,
      rooms: course.rooms,
    })
    setIsSheetOpen(true)
  }

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId))
  }

  const handleSubmit = () => {
    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? { ...c, ...formData }
            : c
        )
      )
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...formData,
      }
      setCourses([...courses, newCourse])
    }
    setIsSheetOpen(false)
  }

  // Get lecturer name by code
  const getLecturerName = (code: string) => {
    if (!code) return null
    const lecturer = mockLecturers.find((l) => l.code === code)
    return lecturer ? lecturer.name : code
  }

  const isFormValid = formData.kodeMatakuliah && formData.mataKuliah && formData.kelas && formData.prodi

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Courses"
          description="Manage course catalog"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Course Catalog</h2>
                  <p className="text-sm text-muted-foreground">{courses.length} courses available</p>
                </div>
              </div>
              
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-lg shadow-primary/20"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>

            {/* Main Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">All Courses</CardTitle>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
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
                        <TableHead className="font-semibold text-foreground">Course Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Program Studi</TableHead>
                        <TableHead className="font-semibold text-foreground">Class</TableHead>
                        <TableHead className="font-semibold text-foreground">SKS</TableHead>
                        <TableHead className="font-semibold text-foreground">Students</TableHead>
                        <TableHead className="font-semibold text-foreground">Lecturers</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No courses found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCourses.map((course) => {
                          const lecturers = [
                            course.kodeDosen1,
                            course.kodeDosen2,
                            course.kodeDosenProdiLain1,
                            course.kodeDosenProdiLain2,
                          ].filter(Boolean)

                          return (
                            <TableRow
                              key={course.id}
                              className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                            >
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="font-mono font-semibold text-primary border-primary/30 bg-primary/5"
                                >
                                  {course.kodeMatakuliah}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-foreground">{course.mataKuliah}</div>
                                <div className="flex gap-1 mt-1">
                                  {course.shouldOnTheLab && (
                                    <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/30">
Should be in the lab
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {course.jenis}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">{course.prodi}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-normal bg-secondary/60">
                                  {course.kelas}
                                </Badge>
                                <div className="text-xs text-muted-foreground mt-1 capitalize">
                                  {course.classType}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="size-3.5 text-muted-foreground" />
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2">
                                    {course.sks} SKS
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Users className="size-3.5 text-muted-foreground" />
                                  <span className="text-sm">{course.peserta}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {lecturers.length > 0 ? (
                                    lecturers.map((code, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs font-medium border-chart-2/30 text-chart-2 bg-chart-2/5"
                                        title={getLecturerName(code) || code}
                                      >
                                        {code}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground italic">No lecturer</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(course)}
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
                                        <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete <strong>{course.mataKuliah}</strong>? 
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(course.id)}
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
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</SheetTitle>
              <SheetDescription>
                {editingCourse 
                  ? 'Update the course details below.' 
                  : 'Fill in the details to add a new course.'}
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              {/* Basic Info */}
              <div className="grid gap-2">
                <Label htmlFor="prodi">Program Studi</Label>
                <Input
                  id="prodi"
                  placeholder="e.g., Informatika"
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="kodeMatakuliah">Course Code</Label>
                  <Input
                    id="kodeMatakuliah"
                    placeholder="e.g., IF13KA14"
                    value={formData.kodeMatakuliah}
                    onChange={(e) => setFormData({ ...formData, kodeMatakuliah: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="kelas">Class</Label>
                  <Input
                    id="kelas"
                    placeholder="e.g., IF-3A"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="mataKuliah">Course Name</Label>
                <Input
                  id="mataKuliah"
                  placeholder="e.g., Kalkulus"
                  value={formData.mataKuliah}
                  onChange={(e) => setFormData({ ...formData, mataKuliah: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sks">SKS</Label>
                  <Input
                    id="sks"
                    type="number"
                    min={1}
                    max={6}
                    placeholder="e.g., 3"
                    value={formData.sks}
                    onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="peserta">Students</Label>
                  <Input
                    id="peserta"
                    type="number"
                    min={1}
                    placeholder="e.g., 35"
                    value={formData.peserta}
                    onChange={(e) => setFormData({ ...formData, peserta: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="classType">Class Type</Label>
                  <Select
                    value={formData.classType}
                    onValueChange={(value: 'pagi' | 'sore') => 
                      setFormData({ ...formData, classType: value })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagi">Pagi (Morning)</SelectItem>
                      <SelectItem value="sore">Sore (Afternoon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="jenis">Course Type (Jenis)</Label>
                <Select
                  value={formData.jenis}
                  onValueChange={(value: 'wajib' | 'pilihan') =>
                    setFormData({ ...formData, jenis: value })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wajib">Wajib</SelectItem>
                    <SelectItem value="pilihan">Pilihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shouldOnTheLab"
                  checked={formData.shouldOnTheLab}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, shouldOnTheLab: checked as boolean })
                  }
                />
                <Label htmlFor="shouldOnTheLab" className="cursor-pointer">
                  Should be in the lab
                </Label>
              </div>
              
              {/* Lecturers Section */}
              <div className="border-t pt-4">
                <Label className="text-base font-semibold mb-3 block">Lecturers</Label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kodeDosen1">Primary Lecturer</Label>
                    <Select
                      value={formData.kodeDosen1 || "__none__"}
                      onValueChange={(value) => setFormData({ ...formData, kodeDosen1: value === "__none__" ? "" : value })}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {mockLecturers.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            <span className="truncate max-w-[250px] block" title={`${l.code} - ${l.name}`}>
                              {l.code} - {l.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="kodeDosen2">Secondary Lecturer</Label>
                    <Select
                      value={formData.kodeDosen2 || "__none__"}
                      onValueChange={(value) => setFormData({ ...formData, kodeDosen2: value === "__none__" ? "" : value })}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {mockLecturers.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            <span className="truncate max-w-[250px] block" title={`${l.code} - ${l.name}`}>
                              {l.code} - {l.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="kodeDosenProdiLain1">External Lecturer 1</Label>
                    <Select
                      value={formData.kodeDosenProdiLain1 || "__none__"}
                      onValueChange={(value) => setFormData({ ...formData, kodeDosenProdiLain1: value === "__none__" ? "" : value })}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {mockLecturers.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            <span className="truncate max-w-[250px] block" title={`${l.code} - ${l.name}`}>
                              {l.code} - {l.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="kodeDosenProdiLain2">External Lecturer 2</Label>
                    <Select
                      value={formData.kodeDosenProdiLain2 || "__none__"}
                      onValueChange={(value) => setFormData({ ...formData, kodeDosenProdiLain2: value === "__none__" ? "" : value })}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {mockLecturers.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            <span className="truncate max-w-[250px] block" title={`${l.code} - ${l.name}`}>
                              {l.code} - {l.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Rooms */}
              <div className="border-t pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="rooms">Preferred Rooms</Label>
                  <Input
                    id="rooms"
                    placeholder="e.g., CM-101,CM-102"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple rooms with commas
                  </p>
                </div>
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
                {editingCourse ? 'Update Course' : 'Add Course'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
