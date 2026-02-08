// ==================== DATA STRUCTURE MATCHING DATA_UISI.XLSX ====================

// Sheet: ruangan
export interface Room {
  id: string
  code: string
  name: string
  type: 'theory' | 'lab_multimedia'
  capacity: number
}

// Sheet: dosen
export interface Lecturer {
  id: string
  prodi: string
  code: string
  name: string
  preferredTime: string
  researchDay: string
  transitTime: number
  maxDailyPeriods: number
  preferredRoom: string
}

// Sheet: kebutuhan_kelas
export interface Course {
  id: string
  prodi: string
  kelas: string
  kodeMatakuliah: string
  mataKuliah: string
  sks: number
  jenis: 'wajib' | 'pilihan'
  peserta: number
  kodeDosen1: string
  kodeDosen2: string
  kodeDosenProdiLain1: string
  kodeDosenProdiLain2: string
  classType: 'pagi' | 'sore'
  shouldOnTheLab: boolean
  rooms: string
}

// ==================== LEGACY INTERFACES (for compatibility) ====================
export interface CourseLegacy {
  id: string
  code: string
  name: string
  credits: number
  department: string
  requiredSessions: number
  sessionDuration: number // in minutes
  preferredTimeSlots?: TimeSlot[]
  lecturerId: string
}

export interface LecturerLegacy {
  id: string
  name: string
  email: string
  department: string
  maxHoursPerWeek: number
  preferredTimeSlots?: TimeSlot[]
  unavailableSlots?: TimeSlot[]
}

export interface RoomLegacy {
  id: string
  name: string
  building: string
  capacity: number
  type: 'theory' | 'lab_multimedia'
  equipment: string[]
}

export interface TimeSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  startTime: string // HH:mm format
  endTime: string // HH:mm format
}

export interface ScheduleEntry {
  id: string
  courseId: string
  lecturerId: string
  roomId: string
  timeSlot: TimeSlot
  conflicts?: Conflict[]
}

export interface Conflict {
  type: 'room' | 'lecturer' | 'student' | 'capacity' | 'preference'
  severity: 'hard' | 'soft'
  description: string
  relatedEntryId?: string
}

export interface Schedule {
  id: string
  name: string
  semester: string
  year: number
  entries: ScheduleEntry[]
  fitness: number
  createdAt: Date
  updatedAt: Date
}

// ==================== FORM STATE TYPES ====================
export interface RoomFormData {
  code: string
  name: string
  type: 'theory' | 'lab_multimedia'
  capacity: number
}

export interface LecturerFormData {
  prodi: string
  code: string
  name: string
  preferredTime: string
  researchDay: string
  transitTime: number
  maxDailyPeriods: number
  preferredRoom: string
}

export interface CourseFormData {
  prodi: string
  kelas: string
  kodeMatakuliah: string
  mataKuliah: string
  sks: number
  jenis: 'wajib' | 'pilihan'
  peserta: number
  kodeDosen1: string
  kodeDosen2: string
  kodeDosenProdiLain1: string
  kodeDosenProdiLain2: string
  classType: 'pagi' | 'sore'
  shouldOnTheLab: boolean
  rooms: string
}

export interface OptimizationParams {
  populationSize: number
  generations: number
  mutationRate: number
  crossoverRate: number
  elitismRate: number
  tournamentSize: number
}

export interface OptimizationProgress {
  currentIteration: number
  totalIterations: number
  bestCost: number
  currentCost: number
  hardConstraintViolations: number
  softConstraintViolations: number
  isRunning: boolean
  startTime?: Date
  estimatedTimeRemaining?: number // in seconds
}

export interface DashboardStats {
  totalCourses: number
  totalLecturers: number
  totalRooms: number
  scheduledSessions: number
  conflictCount: number
  utilizationRate: number
  lastOptimizationFitness: number
}
