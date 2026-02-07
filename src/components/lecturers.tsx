import { Plus, Search, Users, Mail } from 'lucide-react'
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
                  <p className="text-sm text-muted-foreground">{mockLecturers.length} lecturers registered</p>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-chart-2 to-chart-2/90 hover:opacity-90 shadow-lg shadow-chart-2/20">
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
                        <TableHead className="font-semibold text-foreground">Name</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Department</TableHead>
                        <TableHead className="font-semibold text-foreground">Max Hours</TableHead>
                        <TableHead className="font-semibold text-foreground">Assigned Courses</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLecturers.map((lecturer) => {
                        const assignedCourses = mockCourses.filter(
                          (c) => c.lecturerId === lecturer.id
                        )
                        return (
                          <TableRow 
                            key={lecturer.id} 
                            className="group border-border/50 hover:bg-muted/30 transition-colors duration-200"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm border border-primary/20">
                                  {lecturer.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </div>
                                <span className="font-medium text-foreground">{lecturer.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="size-3.5" />
                                <span className="text-sm">{lecturer.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary"
                                className="font-normal bg-secondary/60"
                              >
                                {lecturer.department}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-chart-3/10 text-chart-3">
                                {lecturer.maxHoursPerWeek}h/week
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {assignedCourses.length > 0 ? (
                                  assignedCourses.map((course) => (
                                    <Badge
                                      key={course.id}
                                      variant="outline"
                                      className="text-xs font-medium border-primary/30 text-primary bg-primary/5"
                                    >
                                      {course.code}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground italic">No courses assigned</span>
                                )}
                              </div>
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