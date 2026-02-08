export interface TimeSlot {
  period: number
  day: string
  startTime: string
  endTime: string
}

export interface ScheduleEntry {
  classId: string
  className: string
  class: string
  prodi: string
  lecturers: string[]
  room: string
  timeSlot: TimeSlot
  sks: number
  needsLab: boolean
  participants: number
  classType: 'pagi' | 'sore'
  prayerTimeAdded: number
  isOverflowToLab: boolean
}

export interface ScheduleData {
  fitness: number
  hardViolations: number
  softViolations: number
  iterations: number
  schedule: ScheduleEntry[]
}

// Color mapping for departments/prodi
export const PRODI_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  // Manajemen variants
  'MANAJEMEN': { bg: 'bg-blue-500/10', border: 'border-l-blue-500', text: 'text-blue-400' },
  'S1 Manajemen': { bg: 'bg-blue-500/10', border: 'border-l-blue-500', text: 'text-blue-400' },
  'S2 Manajemen': { bg: 'bg-indigo-500/10', border: 'border-l-indigo-500', text: 'text-indigo-400' },
  'Magister Manajemen': { bg: 'bg-indigo-500/10', border: 'border-l-indigo-500', text: 'text-indigo-400' },
  'S2 Manajemen/Magister Manajemen': { bg: 'bg-indigo-500/10', border: 'border-l-indigo-500', text: 'text-indigo-400' },
  
  // Ekonomi Syariah variants
  'Ekonomi Syariah': { bg: 'bg-emerald-500/10', border: 'border-l-emerald-500', text: 'text-emerald-400' },
  'S1 Ekonomi Syariah': { bg: 'bg-emerald-500/10', border: 'border-l-emerald-500', text: 'text-emerald-400' },
  
  // Akuntansi variants
  'Akuntansi': { bg: 'bg-amber-500/10', border: 'border-l-amber-500', text: 'text-amber-400' },
  'S1 Akuntansi': { bg: 'bg-amber-500/10', border: 'border-l-amber-500', text: 'text-amber-400' },
  
  // Sistem Informasi variants
  'SISTEM INFORMASI': { bg: 'bg-cyan-500/10', border: 'border-l-cyan-500', text: 'text-cyan-400' },
  'S1 Sistem Informasi': { bg: 'bg-cyan-500/10', border: 'border-l-cyan-500', text: 'text-cyan-400' },
  
  // Informatika variants
  'INFORMATIKA': { bg: 'bg-violet-500/10', border: 'border-l-violet-500', text: 'text-violet-400' },
  'S1 Informatika': { bg: 'bg-violet-500/10', border: 'border-l-violet-500', text: 'text-violet-400' },
  
  // Teknik Logistik variants
  'TEKNIK LOGISTIK': { bg: 'bg-rose-500/10', border: 'border-l-rose-500', text: 'text-rose-400' },
  'S1 Teknik Logistik': { bg: 'bg-rose-500/10', border: 'border-l-rose-500', text: 'text-rose-400' },
  
  // Teknik Kimia variants
  'Teknik Kimia': { bg: 'bg-orange-500/10', border: 'border-l-orange-500', text: 'text-orange-400' },
  'S1 Teknik Kimia': { bg: 'bg-orange-500/10', border: 'border-l-orange-500', text: 'text-orange-400' },
  
  // Manajemen Rekayasa variants
  'Manajemen Rekayasa': { bg: 'bg-teal-500/10', border: 'border-l-teal-500', text: 'text-teal-400' },
  'S1 Manajemen Rekayasa': { bg: 'bg-teal-500/10', border: 'border-l-teal-500', text: 'text-teal-400' },
  
  // Desain Komunikasi Visual variants
  'DESAIN KOMUNIKASI VISUAL': { bg: 'bg-pink-500/10', border: 'border-l-pink-500', text: 'text-pink-400' },
  'S1 Desain Komunikasi Visual': { bg: 'bg-pink-500/10', border: 'border-l-pink-500', text: 'text-pink-400' },
  
  // Teknologi Industri Pertanian variants
  'Teknologi Industri Pertanian': { bg: 'bg-lime-500/10', border: 'border-l-lime-500', text: 'text-lime-400' },
  'S1 Teknologi Industri Pertanian': { bg: 'bg-lime-500/10', border: 'border-l-lime-500', text: 'text-lime-400' },
}

export const getProdiColor = (prodi: string) => {
  return PRODI_COLORS[prodi] || { bg: 'bg-muted/50', border: 'border-l-muted-foreground', text: 'text-muted-foreground' }
}

// Time slots based on the schedule
export const TIME_SLOTS = [
  { label: '07:30-08:20', start: '07:30', end: '08:20' },
  { label: '08:20-09:10', start: '08:20', end: '09:10' },
  { label: '09:10-10:00', start: '09:10', end: '10:00' },
  { label: '10:00-10:50', start: '10:00', end: '10:50' },
  { label: '10:50-11:40', start: '10:50', end: '11:40' },
  { label: '11:40-12:30', start: '11:40', end: '12:30' },
  { label: '12:30-13:20', start: '12:30', end: '13:20' },
  { label: '13:20-14:10', start: '13:20', end: '14:10' },
  { label: '14:10-15:00', start: '14:10', end: '15:00' },
  { label: '15:00-15:30', start: '15:00', end: '15:30' },
  { label: '15:30-16:20', start: '15:30', end: '16:20' },
  { label: '16:20-17:10', start: '16:20', end: '17:10' },
  { label: '17:10-18:00', start: '17:10', end: '18:00' },
  { label: '18:00-18:30', start: '18:00', end: '18:30' },
  { label: '18:30-19:20', start: '18:30', end: '19:20' },
  { label: '19:20-20:10', start: '19:20', end: '20:10' },
  { label: '20:10-21:00', start: '20:10', end: '21:00' },
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

// Helper to calculate time slot row span based on SKS
export const calculateRowSpan = (sks: number): number => {
  // Each SKS is roughly 50 minutes, each row is 50 minutes
  return sks
}

// Helper to get starting row index based on start time
export const getStartRowIndex = (startTime: string): number => {
  const index = TIME_SLOTS.findIndex(slot => slot.start === startTime)
  return index >= 0 ? index : 0
}

// Check if time overlaps with prayer time (dzuhur: 11:40-12:30)
export const hasOverlapWithPrayerTime = (startTime: string, endTime: string): boolean => {
  const prayerStart = '11:40'
  const prayerEnd = '12:30'
  return startTime < prayerEnd && endTime > prayerStart
}
