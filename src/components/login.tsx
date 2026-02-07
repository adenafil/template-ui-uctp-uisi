import { useState } from 'react'
import { Eye, EyeOff, GraduationCap, BookOpen, Users, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const features = [
    { icon: BookOpen, label: 'Course Management', value: '150+' },
    { icon: Users, label: 'Faculty Members', value: '45' },
    { icon: Building2, label: 'Classrooms', value: '28' },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col bg-muted/30 border-r border-border">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground tracking-tight">UCTP</span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest">
                Academic System
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-12 flex flex-col justify-center">
          <div className="max-w-md">
            {/* Title Section */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                University Course
                <br />
                <span className="text-primary">Timetabling System</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive scheduling platform for Universitas Internasional 
                Semen Indonesia. Optimizing academic resources through intelligent 
                algorithmic scheduling.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {features.map((feature) => (
                <div 
                  key={feature.label}
                  className="text-center p-4 rounded-xl bg-card border border-border/50"
                >
                  <feature.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{feature.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                    {feature.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Description Cards */}
            <div className="space-y-3">
              {[
                'Automated conflict detection and resolution',
                'Simulated Annealing optimization algorithms',
                'Drag-and-drop manual schedule adjustments',
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Universitas Internasional Semen Indonesia
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground">UCTP</span>
              <span className="block text-[9px] text-muted-foreground uppercase tracking-wider">
                Academic System
              </span>
            </div>
          </div>
        </div>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sign In
              </h2>
              <p className="text-sm text-muted-foreground">
                Access your dashboard to manage academic scheduling
              </p>
            </div>

            {/* Error Message */}
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Invalid email or password
            </div>

            {/* Form */}
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@uisi.ac.id"
                  required
                  className="h-11 bg-background border-input focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    className="h-11 bg-background border-input pr-10 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Keep me signed in
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
                  Demo Access
                </span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-medium text-foreground">Demo:</span>{' '}
                admin@uisi.ac.id / admin123
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 lg:hidden">
          <p className="text-xs text-muted-foreground text-center">
            &copy; 2026 Universitas Internasional Semen Indonesia
          </p>
        </div>
      </div>
    </div>
  )
}