import { Plus, Search, BookOpen } from 'lucide-react'
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
                  <p className="text-sm text-muted-foreground">{mockCourses.length} courses available</p>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-lg shadow-primary/20">
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
                        <TableHead className="font-semibold text-foreground">Department</TableHead>
                        <TableHead className="font-semibold text-foreground">Credits</TableHead>
                        <TableHead className="font-semibold text-foreground">Sessions</TableHead>
                        <TableHead className="font-semibold text-foreground">Lecturer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCourses.map((course, index) => {
                        const lecturer = mockLecturers.find(
                          (l) => l.id === course.lecturerId
                        )
                        return (
                          <TableRow 
                            key={course.id} 
                            className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="font-mono font-semibold text-primary border-primary/30 bg-primary/5"
                              >
                                {course.code}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{course.name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className="font-normal bg-secondary/60 text-secondary-foreground"
                              >
                                {course.department}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2">
                                {course.credits} SKS
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {course.requiredSessions}× {course.sessionDuration}min
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {lecturer?.name || <span className="italic opacity-50">Unassigned</span>}
                            </TableCell>
                          </TableRow>
                        )
                      })}
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