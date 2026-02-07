'use client'

import { useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Flame,
  ListX,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SACostChart } from '@/components/optimization/sa-cost-chart'
import { TemperatureChart } from '@/components/optimization/temperature-chart'
import { ViolationsChart } from '@/components/optimization/violations-chart'
import { TabuChart } from '@/components/optimization/tabu-chart'
import { ResultsTable } from '@/components/optimization/results-table'
import {
  DEFAULT_SA_CONFIG,
  type SAConfig,
  type OptimizationResult,
} from '@/lib/optimization-types'
import { mockOptimizationResults } from '@/lib/mock-optimization-data'

export default function OptimizationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [config, setConfig] = useState<SAConfig>(DEFAULT_SA_CONFIG)
  const [results, setResults] = useState<OptimizationResult[]>(mockOptimizationResults)
  const [selectedResult, setSelectedResult] = useState<OptimizationResult | null>(
    mockOptimizationResults[0]
  )
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    reheating: false,
    tabu: true,
    intensification: false,
  })

  const currentIteration = 0
  const progress = (currentIteration / config.maxIterations) * 100

  const updateConfig = <K extends keyof SAConfig>(key: K, value: SAConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleDelete = (ids: string[]) => {
    setResults((prev) => prev.filter((r) => !ids.includes(r.id)))
    if (selectedResult && ids.includes(selectedResult.id)) {
      setSelectedResult(null)
    }
  }

  const handleRerun = (result: OptimizationResult) => {
    // Apply the config from the result and start running
    if (result.config) {
      setConfig((prev) => ({ ...prev, ...result.config }))
    }
    setIsRunning(true)
  }

  const handleExport = (toExport: OptimizationResult[], format: 'csv' | 'json') => {
    if (format === 'json') {
      const data = JSON.stringify(toExport, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `optimization-results-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // CSV export
      const headers = [
        'ID',
        'Name',
        'Created At',
        'Status',
        'Final Cost',
        'Initial Cost',
        'Improvement %',
        'Hard Violations',
        'Soft Violations',
        'Total Iterations',
        'Duration',
      ]
      const rows = toExport.map((r) => [
        r.id,
        r.name,
        r.createdAt,
        r.status,
        r.metrics.finalCost,
        r.metrics.initialCost,
        r.metrics.improvement,
        r.metrics.hardViolations,
        r.metrics.softViolations,
        r.metrics.totalIterations,
        r.metrics.duration,
      ])
      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `optimization-results-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Optimization"
          description="Simulated Annealing + Tabu Search configuration and execution"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Control Panel */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Optimization Control</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isRunning ? 'destructive' : 'default'}
                      onClick={() => setIsRunning(!isRunning)}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="mr-1 size-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 size-4" />
                          Start Optimization
                        </>
                      )}
                    </Button>
                    <Button variant="outline" disabled={isRunning}>
                      <RotateCcw className="mr-1 size-4" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>
                      Iteration {currentIteration.toLocaleString()} /{' '}
                      {config.maxIterations.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4 lg:grid-cols-6">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Best Cost</div>
                      <div className="text-xl font-semibold text-chart-1">0</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Current Cost</div>
                      <div className="text-xl font-semibold text-chart-2">0</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="text-xl font-semibold text-chart-4">
                        {config.initialTemperature.toExponential(0)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Hard Violations</div>
                      <div className="text-xl font-semibold text-destructive">0</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Soft Violations</div>
                      <div className="text-xl font-semibold text-chart-3">0</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Tabu Hits</div>
                      <div className="text-xl font-semibold text-chart-5">0</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-3">
              {/* Parameters */}
              <div className="space-y-4 xl:col-span-1">
                <Card className="bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Settings2 className="size-4" />
                      Algorithm Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Core SA Parameters */}
                    <Collapsible
                      open={expandedSections.core}
                      onOpenChange={() => toggleSection('core')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted">
                        <span className="flex items-center gap-2">
                          <Flame className="size-4 text-chart-4" />
                          Core SA Parameters
                        </span>
                        {expandedSections.core ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Initial Temperature</Label>
                            <Input
                              type="number"
                              value={config.initialTemperature}
                              onChange={(e) =>
                                updateConfig('initialTemperature', Number(e.target.value))
                              }
                              className="h-7 w-24 text-xs"
                              disabled={isRunning}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Min Temperature</Label>
                            <Input
                              type="number"
                              value={config.minTemperature}
                              onChange={(e) =>
                                updateConfig('minTemperature', Number(e.target.value))
                              }
                              className="h-7 w-24 text-xs"
                              disabled={isRunning}
                              step="0.0000001"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Cooling Rate</Label>
                            <span className="text-xs text-muted-foreground">
                              {config.coolingRate}
                            </span>
                          </div>
                          <Slider
                            value={[config.coolingRate * 10000]}
                            onValueChange={([v]) => updateConfig('coolingRate', v / 10000)}
                            min={9900}
                            max={9999}
                            step={1}
                            disabled={isRunning}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Max Iterations</Label>
                            <span className="text-xs text-muted-foreground">
                              {config.maxIterations.toLocaleString()}
                            </span>
                          </div>
                          <Slider
                            value={[config.maxIterations]}
                            onValueChange={([v]) => updateConfig('maxIterations', v)}
                            min={1000}
                            max={50000}
                            step={1000}
                            disabled={isRunning}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Hard Constraint Weight</Label>
                            <Input
                              type="number"
                              value={config.hardConstraintWeight}
                              onChange={(e) =>
                                updateConfig('hardConstraintWeight', Number(e.target.value))
                              }
                              className="h-7 w-24 text-xs"
                              disabled={isRunning}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Reheating Configuration */}
                    <Collapsible
                      open={expandedSections.reheating}
                      onOpenChange={() => toggleSection('reheating')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted">
                        <span className="flex items-center gap-2">
                          <Zap className="size-4 text-warning" />
                          Reheating
                        </span>
                        {expandedSections.reheating ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Reheating Threshold</Label>
                            <span className="text-xs text-muted-foreground">
                              {config.reheatingThreshold}
                            </span>
                          </div>
                          <Slider
                            value={[config.reheatingThreshold]}
                            onValueChange={([v]) => updateConfig('reheatingThreshold', v)}
                            min={100}
                            max={2000}
                            step={50}
                            disabled={isRunning}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Reheating Factor</Label>
                            <span className="text-xs text-muted-foreground">
                              {config.reheatingFactor}
                            </span>
                          </div>
                          <Slider
                            value={[config.reheatingFactor]}
                            onValueChange={([v]) => updateConfig('reheatingFactor', v)}
                            min={10}
                            max={500}
                            step={10}
                            disabled={isRunning}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Max Reheats</Label>
                            <span className="text-xs text-muted-foreground">
                              {config.maxReheats}
                            </span>
                          </div>
                          <Slider
                            value={[config.maxReheats]}
                            onValueChange={([v]) => updateConfig('maxReheats', v)}
                            min={1}
                            max={20}
                            step={1}
                            disabled={isRunning}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Tabu Search Configuration */}
                    <Collapsible
                      open={expandedSections.tabu}
                      onOpenChange={() => toggleSection('tabu')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted">
                        <span className="flex items-center gap-2">
                          <ListX className="size-4 text-chart-5" />
                          Tabu Search
                        </span>
                        {expandedSections.tabu ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Enable Tabu Search</Label>
                          <Switch
                            checked={config.tabuSearchEnabled}
                            onCheckedChange={(v) => updateConfig('tabuSearchEnabled', v)}
                            disabled={isRunning}
                          />
                        </div>
                        {config.tabuSearchEnabled && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Tabu Tenure</Label>
                                <span className="text-xs text-muted-foreground">
                                  {config.tabuTenure}
                                </span>
                              </div>
                              <Slider
                                value={[config.tabuTenure]}
                                onValueChange={([v]) => updateConfig('tabuTenure', v)}
                                min={10}
                                max={200}
                                step={5}
                                disabled={isRunning}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Max Tabu List Size</Label>
                                <span className="text-xs text-muted-foreground">
                                  {config.maxTabuListSize.toLocaleString()}
                                </span>
                              </div>
                              <Slider
                                value={[config.maxTabuListSize]}
                                onValueChange={([v]) => updateConfig('maxTabuListSize', v)}
                                min={100}
                                max={5000}
                                step={100}
                                disabled={isRunning}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Aspiration Enabled</Label>
                              <Switch
                                checked={config.aspirationEnabled}
                                onCheckedChange={(v) => updateConfig('aspirationEnabled', v)}
                                disabled={isRunning}
                              />
                            </div>
                          </>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Intensification Configuration */}
                    <Collapsible
                      open={expandedSections.intensification}
                      onOpenChange={() => toggleSection('intensification')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm font-medium hover:bg-muted">
                        <span className="flex items-center gap-2">
                          <Zap className="size-4 text-chart-1" />
                          Intensification
                        </span>
                        {expandedSections.intensification ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Enable Intensification</Label>
                          <Switch
                            checked={config.enableIntensification}
                            onCheckedChange={(v) => updateConfig('enableIntensification', v)}
                            disabled={isRunning}
                          />
                        </div>
                        {config.enableIntensification && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Intensification Iterations</Label>
                                <span className="text-xs text-muted-foreground">
                                  {config.intensificationIterations.toLocaleString()}
                                </span>
                              </div>
                              <Slider
                                value={[config.intensificationIterations]}
                                onValueChange={([v]) =>
                                  updateConfig('intensificationIterations', v)
                                }
                                min={500}
                                max={10000}
                                step={500}
                                disabled={isRunning}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Max Attempts</Label>
                                <span className="text-xs text-muted-foreground">
                                  {config.maxIntensificationAttempts}
                                </span>
                              </div>
                              <Slider
                                value={[config.maxIntensificationAttempts]}
                                onValueChange={([v]) =>
                                  updateConfig('maxIntensificationAttempts', v)
                                }
                                min={1}
                                max={10}
                                step={1}
                                disabled={isRunning}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Operator Selection Mode</Label>
                              <Select
                                value={config.operatorSelectionMode}
                                onValueChange={(v) =>
                                  updateConfig(
                                    'operatorSelectionMode',
                                    v as SAConfig['operatorSelectionMode']
                                  )
                                }
                                disabled={isRunning}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="adaptive">Adaptive</SelectItem>
                                  <SelectItem value="random">Random</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="space-y-4 xl:col-span-2">
                <Tabs defaultValue="cost" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cost">Cost</TabsTrigger>
                    <TabsTrigger value="temperature">Temperature</TabsTrigger>
                    <TabsTrigger value="violations">Violations</TabsTrigger>
                    <TabsTrigger value="tabu">Tabu</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cost" className="mt-4">
                    {selectedResult ? (
                      <SACostChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[350px] items-center justify-center bg-card">
                        <p className="text-muted-foreground">
                          Select a result to view charts
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                  <TabsContent value="temperature" className="mt-4">
                    {selectedResult ? (
                      <TemperatureChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[250px] items-center justify-center bg-card">
                        <p className="text-muted-foreground">
                          Select a result to view charts
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                  <TabsContent value="violations" className="mt-4">
                    {selectedResult ? (
                      <ViolationsChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[250px] items-center justify-center bg-card">
                        <p className="text-muted-foreground">
                          Select a result to view charts
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                  <TabsContent value="tabu" className="mt-4">
                    {selectedResult ? (
                      <TabuChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[250px] items-center justify-center bg-card">
                        <p className="text-muted-foreground">
                          Select a result to view charts
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Selected Result Summary */}
                {selectedResult && (
                  <Card className="bg-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {selectedResult.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Accepted Moves
                          </div>
                          <div className="text-lg font-semibold">
                            {selectedResult.metrics.acceptedMoves.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Rejected Moves
                          </div>
                          <div className="text-lg font-semibold">
                            {selectedResult.metrics.rejectedMoves.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Total Reheats
                          </div>
                          <div className="text-lg font-semibold">
                            {selectedResult.metrics.totalReheats}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Convergence At
                          </div>
                          <div className="text-lg font-semibold">
                            {selectedResult.metrics.convergenceIteration > 0
                              ? selectedResult.metrics.convergenceIteration.toLocaleString()
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Results Table */}
            <ResultsTable
              results={results}
              selectedId={selectedResult?.id}
              onSelect={setSelectedResult}
              onDelete={handleDelete}
              onRerun={handleRerun}
              onExport={handleExport}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
