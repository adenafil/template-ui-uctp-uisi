import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ScheduleEntry } from '@/lib/schedule-types'
import { DAYS, TIME_SLOTS, getProdiColor } from '@/lib/schedule-types'

interface ScheduleEditSheetProps {
  entry: ScheduleEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: ScheduleEntry) => void
  availableRooms: string[]
}

export function ScheduleEditSheet({
  entry,
  open,
  onOpenChange,
  onSave,
  availableRooms,
}: ScheduleEditSheetProps) {
  const [formData, setFormData] = useState<ScheduleEntry | null>(null)

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry })
    }
  }, [entry])

  if (!formData) return null

  const colors = getProdiColor(formData.prodi)

  const handleSave = () => {
    if (formData) {
      onSave(formData)
      onOpenChange(false)
    }
  }

  const updateTimeSlot = (field: keyof typeof formData.timeSlot, value: string) => {
    setFormData({
      ...formData,
      timeSlot: {
        ...formData.timeSlot,
        [field]: value,
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Jadwal</SheetTitle>
          <SheetDescription>
            Ubah informasi jadwal mata kuliah
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 mx-3 -mt-4">
          {/* Course Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={`${colors.bg} ${colors.text} border-0`}>
                {formData.prodi}
              </Badge>
              {formData.needsLab && (
                <Badge variant="outline">Lab Required</Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="className">Nama Mata Kuliah</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Kode MK</Label>
                <Input
                  id="classId"
                  value={formData.classId}
                  onChange={(e) =>
                    setFormData({ ...formData, classId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Kelas</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sks">SKS</Label>
                <Input
                  id="sks"
                  type="number"
                  min={1}
                  max={6}
                  value={formData.sks}
                  onChange={(e) =>
                    setFormData({ ...formData, sks: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Peserta</Label>
                <Input
                  id="participants"
                  type="number"
                  min={1}
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      participants: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lecturers">Dosen (pisahkan dengan koma)</Label>
              <Input
                id="lecturers"
                value={formData.lecturers.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lecturers: e.target.value.split(',').map((l) => l.trim()),
                  })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Time & Room Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Waktu & Ruangan</h4>

            <div className="space-y-2">
              <Label htmlFor="day">Hari</Label>
              <Select
                value={formData.timeSlot.day}
                onValueChange={(value) => updateTimeSlot('day', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Jam Mulai</Label>
                <Select
                  value={formData.timeSlot.startTime}
                  onValueChange={(value) => updateTimeSlot('startTime', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Pilih jam mulai" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.start} value={slot.start}>
                        {slot.start}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Jam Selesai</Label>
                <Select
                  value={formData.timeSlot.endTime}
                  onValueChange={(value) => updateTimeSlot('endTime', value)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Pilih jam selesai" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.end} value={slot.end}>
                        {slot.end}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Ruangan</Label>
              <Select
                value={formData.room}
                onValueChange={(value) =>
                  setFormData({ ...formData, room: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Pilih ruangan" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
