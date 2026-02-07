import { Plus, Search, Mail } from 'lucide-react'
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
import { mockLecturers, mockCourses } from '@/lib/mock-data'

export default function LecturersPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Lecturers"
          description="Manage faculty members"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>All Lecturers</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search lecturers..."
                      className="h-9 w-64 bg-muted/50 pl-9"
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Lecturer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Max Hours/Week</TableHead>
                      <TableHead>Assigned Courses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLecturers.map((lecturer) => {
                      const assignedCourses = mockCourses.filter(
                        (c) => c.lecturerId === lecturer.id
                      )
                      return (
                        <TableRow key={lecturer.id} className="border-border">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {lecturer.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <span className="font-medium">{lecturer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Mail className="size-3.5" />
                              {lecturer.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {lecturer.department}
                            </Badge>
                          </TableCell>
                          <TableCell>{lecturer.maxHoursPerWeek}h</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {assignedCourses.map((course) => (
                                <Badge
                                  key={course.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {course.code}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
