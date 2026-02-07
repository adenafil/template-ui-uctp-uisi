import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun, Monitor, Settings2, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Settings"
          description="Application configuration"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Appearance Settings */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        theme === 'light' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/60 hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      <Sun className={`h-6 w-6 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}>Light</span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/60 hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      <Moon className={`h-6 w-6 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}>Dark</span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        theme === 'system' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/60 hover:border-primary/30 hover:bg-muted/50'
                      }`}
                    >
                      <Monitor className={`h-6 w-6 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-medium ${theme === 'system' ? 'text-foreground' : 'text-muted-foreground'}`}>System</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-chart-1/10 border border-chart-1/20">
                    <Settings2 className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Configure basic application settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Input
                    id="semester"
                    defaultValue="Genap 2025/2026"
                    className="max-w-sm bg-secondary/50 border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    defaultValue="Universitas Internasional Semen Indonesia"
                    className="max-w-sm bg-secondary/50 border-border/60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-chart-2/10 border border-chart-2/20">
                    <Bell className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage notification preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Schedule</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save schedule changes
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about optimization results
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Optimization Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when optimization completes
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Schedule Constraints */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-chart-3/10 border border-chart-3/20">
                    <Shield className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <CardTitle>Schedule Constraints</CardTitle>
                    <CardDescription>
                      Define hard and soft constraints for scheduling
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Earliest Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      defaultValue="08:00"
                      className="bg-secondary/50 border-border/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Latest End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      defaultValue="18:00"
                      className="bg-secondary/50 border-border/60"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Back-to-Back Classes</Label>
                    <p className="text-sm text-muted-foreground">
                      Lecturers can have consecutive sessions
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Prefer Morning Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Prioritize morning time slots when possible
                    </p>
                  </div>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" className="border-border/60">Reset to Defaults</Button>
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-lg shadow-primary/20">
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}