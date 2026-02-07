export interface SAConfig {
  // Core SA Parameters
  initialTemperature: number
  minTemperature: number
  coolingRate: number
  maxIterations: number
  hardConstraintWeight: number

  // Reheating Configuration
  reheatingThreshold: number
  reheatingFactor: number
  maxReheats: number

  // Tabu Search Configuration
  tabuSearchEnabled: boolean
  tabuTenure: number
  maxTabuListSize: number
  aspirationEnabled: boolean

  // Intensification Configuration
  enableIntensification: boolean
  intensificationIterations: number
  maxIntensificationAttempts: number
  operatorSelectionMode: 'adaptive' | 'random' | 'hybrid'

  // Logging
  logging: {
    enabled: boolean
    level: 'debug' | 'info' | 'warn' | 'error'
    logInterval: number
  }
}

export interface OptimizationResult {
  id: string
  name: string
  createdAt: string
  status: 'completed' | 'running' | 'failed' | 'stopped'
  config: Partial<SAConfig>
  metrics: {
    finalCost: number
    initialCost: number
    improvement: number
    hardViolations: number
    softViolations: number
    totalIterations: number
    totalReheats: number
    tabuHits: number
    acceptedMoves: number
    rejectedMoves: number
    duration: string
    convergenceIteration: number
  }
  history: OptimizationHistoryPoint[]
}

export interface OptimizationHistoryPoint {
  iteration: number
  temperature: number
  currentCost: number
  bestCost: number
  hardViolations: number
  softViolations: number
  tabuListSize: number
  accepted: boolean
}

export const DEFAULT_SA_CONFIG: SAConfig = {
  initialTemperature: 100000,
  minTemperature: 0.0000001,
  coolingRate: 0.9995,
  maxIterations: 20000,
  hardConstraintWeight: 100000,
  reheatingThreshold: 500,
  reheatingFactor: 150,
  maxReheats: 10,
  tabuSearchEnabled: true,
  tabuTenure: 50,
  maxTabuListSize: 1000,
  aspirationEnabled: true,
  enableIntensification: false,
  intensificationIterations: 2000,
  maxIntensificationAttempts: 3,
  operatorSelectionMode: 'hybrid',
  logging: {
    enabled: true,
    level: 'info',
    logInterval: 500,
  },
}
