import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Settings"
          description="Application configuration"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* General Settings */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Input
                    id="semester"
                    defaultValue="Fall 2025"
                    className="max-w-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    defaultValue="University of Technology"
                    className="max-w-sm"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Schedule</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save schedule changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about optimization results
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Schedule Constraints */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Schedule Constraints</CardTitle>
                <CardDescription>
                  Define hard and soft constraints for scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Earliest Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    defaultValue="08:00"
                    className="max-w-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Latest End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    defaultValue="18:00"
                    className="max-w-[150px]"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Back-to-Back Classes</Label>
                    <p className="text-sm text-muted-foreground">
                      Lecturers can have consecutive sessions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Prefer Morning Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Prioritize morning time slots when possible
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
