import type { OptimizationResult, OptimizationHistoryPoint } from './optimization-types'

// Generate mock history data for SA optimization
function generateMockHistory(iterations: number): OptimizationHistoryPoint[] {
  const history: OptimizationHistoryPoint[] = []
  let temperature = 100000
  let currentCost = 50000
  let bestCost = 50000
  let hardViolations = 25
  let softViolations = 150

  for (let i = 0; i <= iterations; i += 100) {
    temperature *= 0.9995 ** 100
    
    // Simulate cost improvement with some noise
    const improvement = Math.random() * 100 - 30
    currentCost = Math.max(0, currentCost - improvement)
    if (currentCost < bestCost) {
      bestCost = currentCost
      hardViolations = Math.max(0, hardViolations - Math.floor(Math.random() * 2))
      softViolations = Math.max(0, softViolations - Math.floor(Math.random() * 5))
    }

    history.push({
      iteration: i,
      temperature,
      currentCost,
      bestCost,
      hardViolations,
      softViolations,
      tabuListSize: Math.min(i / 10, 1000),
      accepted: Math.random() > 0.3,
    })
  }

  return history
}

export const mockOptimizationResults: OptimizationResult[] = [
  {
    id: 'opt-001',
    name: 'Semester Ganjil 2024/2025 - Run 1',
    createdAt: '2025-01-28T14:32:00Z',
    status: 'completed',
    config: {
      initialTemperature: 100000,
      coolingRate: 0.9995,
      maxIterations: 20000,
      tabuSearchEnabled: true,
      tabuTenure: 50,
    },
    metrics: {
      finalCost: 1250,
      initialCost: 48500,
      improvement: 97.4,
      hardViolations: 0,
      softViolations: 12,
      totalIterations: 20000,
      totalReheats: 3,
      tabuHits: 1542,
      acceptedMoves: 8234,
      rejectedMoves: 11766,
      duration: '15m 32s',
      convergenceIteration: 18500,
    },
    history: generateMockHistory(20000),
  },
  {
    id: 'opt-002',
    name: 'Semester Ganjil 2024/2025 - Run 2',
    createdAt: '2025-01-27T09:15:00Z',
    status: 'completed',
    config: {
      initialTemperature: 150000,
      coolingRate: 0.9998,
      maxIterations: 25000,
      tabuSearchEnabled: true,
      tabuTenure: 75,
    },
    metrics: {
      finalCost: 980,
      initialCost: 52000,
      improvement: 98.1,
      hardViolations: 0,
      softViolations: 8,
      totalIterations: 25000,
      totalReheats: 5,
      tabuHits: 2103,
      acceptedMoves: 10521,
      rejectedMoves: 14479,
      duration: '22m 18s',
      convergenceIteration: 23200,
    },
    history: generateMockHistory(25000),
  },
  {
    id: 'opt-003',
    name: 'Semester Genap 2023/2024',
    createdAt: '2025-01-25T16:45:00Z',
    status: 'completed',
    config: {
      initialTemperature: 100000,
      coolingRate: 0.999,
      maxIterations: 15000,
      tabuSearchEnabled: false,
    },
    metrics: {
      finalCost: 3420,
      initialCost: 45000,
      improvement: 92.4,
      hardViolations: 2,
      softViolations: 28,
      totalIterations: 15000,
      totalReheats: 2,
      tabuHits: 0,
      acceptedMoves: 5890,
      rejectedMoves: 9110,
      duration: '11m 45s',
      convergenceIteration: 14200,
    },
    history: generateMockHistory(15000),
  },
  {
    id: 'opt-004',
    name: 'Test Configuration A',
    createdAt: '2025-01-24T11:20:00Z',
    status: 'failed',
    config: {
      initialTemperature: 50000,
      coolingRate: 0.99,
      maxIterations: 10000,
      tabuSearchEnabled: true,
      tabuTenure: 25,
    },
    metrics: {
      finalCost: 12500,
      initialCost: 48000,
      improvement: 73.9,
      hardViolations: 8,
      softViolations: 65,
      totalIterations: 7500,
      totalReheats: 10,
      tabuHits: 890,
      acceptedMoves: 2100,
      rejectedMoves: 5400,
      duration: '5m 12s',
      convergenceIteration: 0,
    },
    history: generateMockHistory(7500),
  },
  {
    id: 'opt-005',
    name: 'Quick Test Run',
    createdAt: '2025-01-23T08:00:00Z',
    status: 'stopped',
    config: {
      initialTemperature: 100000,
      coolingRate: 0.9995,
      maxIterations: 20000,
      tabuSearchEnabled: true,
      tabuTenure: 50,
    },
    metrics: {
      finalCost: 8900,
      initialCost: 47000,
      improvement: 81.1,
      hardViolations: 4,
      softViolations: 42,
      totalIterations: 5000,
      totalReheats: 1,
      tabuHits: 312,
      acceptedMoves: 1890,
      rejectedMoves: 3110,
      duration: '3m 48s',
      convergenceIteration: 0,
    },
    history: generateMockHistory(5000),
  },
]
