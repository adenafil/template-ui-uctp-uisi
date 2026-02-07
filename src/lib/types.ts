export interface Course {
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

export interface Lecturer {
  id: string
  name: string
  email: string
  department: string
  maxHoursPerWeek: number
  preferredTimeSlots?: TimeSlot[]
  unavailableSlots?: TimeSlot[]
}

export interface Room {
  id: string
  name: string
  building: string
  capacity: number
  type: 'lecture' | 'lab' | 'seminar'
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

export interface OptimizationParams {
  populationSize: number
  generations: number
  mutationRate: number
  crossoverRate: number
  elitismRate: number
  tournamentSize: number
}

export interface OptimizationProgress {
  currentGeneration: number
  totalGenerations: number
  bestFitness: number
  averageFitness: number
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
