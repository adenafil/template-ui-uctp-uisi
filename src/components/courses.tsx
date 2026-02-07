import { Plus, Search } from 'lucide-react'
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
import { mockCourses, mockLecturers } from '@/lib/mock-data'

export default function CoursesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Courses"
          description="Manage course catalog"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>All Courses</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      className="h-9 w-64 bg-muted/50 pl-9"
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 size-4" />
                    Add Course
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Lecturer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCourses.map((course) => {
                      const lecturer = mockLecturers.find(
                        (l) => l.id === course.lecturerId
                      )
                      return (
                        <TableRow key={course.id} className="border-border">
                          <TableCell className="font-medium">
                            {course.code}
                          </TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {course.department}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>
                            {course.requiredSessions}x {course.sessionDuration}min
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {lecturer?.name || '-'}
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
