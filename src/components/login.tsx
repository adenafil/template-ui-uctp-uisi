import { useState } from 'react'
import { Calendar, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)


  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full border border-primary" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full border border-primary" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-primary" />
        </div>

        {/* Logo and title */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">UCTP</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground text-balance">
            University Course
            <br />
            Timetabling System
          </h1>
          <p className="text-lg text-muted-foreground max-w-md text-pretty">
            Sistem penjadwalan kuliah cerdas dengan optimisasi algoritma genetika 
            untuk menghasilkan jadwal yang efisien dan bebas konflik.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">
                Optimisasi Otomatis
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-sm text-muted-foreground">
                Deteksi Konflik
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-chart-3" />
              <span className="text-sm text-muted-foreground">
                Drag & Drop
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-chart-5" />
              <span className="text-sm text-muted-foreground">
                Real-time Monitor
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted-foreground">
          &copy; 2026 UCTP. Sistem Penjadwalan Kuliah Universitas.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">UCTP</span>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Selamat Datang</h2>
            <p className="text-muted-foreground">
              Masuk ke akun Anda untuk mengakses sistem penjadwalan
            </p>
          </div>

          {/* Error message */}
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {'Email atau password yang Anda masukkan salah.'}
            </div>

          {/* Login form */}
          <form  className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@universitas.ac.id"
                required
                className="h-11 bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  required
                  className="h-11 bg-secondary border-border pr-10"
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
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Ingat saya di perangkat ini
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
                      >
                          Masuk
            </Button>
          </form>


          {/* Demo credentials hint */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-foreground">Demo:</span>{' '}
              admin@uctp.ac.id / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
