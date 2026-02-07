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
  Sparkles,
  BarChart3,
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
      const headers = [
        'ID', 'Name', 'Created At', 'Status', 'Final Cost', 'Initial Cost',
        'Improvement %', 'Hard Violations', 'Soft Violations', 'Total Iterations', 'Duration',
      ]
      const rows = toExport.map((r) => [
        r.id, r.name, r.createdAt, r.status, r.metrics.finalCost, r.metrics.initialCost,
        r.metrics.improvement, r.metrics.hardViolations, r.metrics.softViolations,
        r.metrics.totalIterations, r.metrics.duration,
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
      <SidebarInset className="bg-background">
        <DashboardHeader
          title="Optimization"
          description="Simulated Annealing + Tabu Search configuration and execution"
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Algorithm Optimization</h2>
                  <p className="text-sm text-muted-foreground">Configure and run SA + Tabu Search</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isRunning && (
                  <Badge variant="outline" className="animate-pulse bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                    Running
                  </Badge>
                )}
              </div>
            </div>

            {/* Control Panel */}
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <CardHeader className="pb-4 bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <BarChart3 className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Optimization Control</CardTitle>
                      <p className="text-sm text-muted-foreground">Monitor and control the optimization process</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isRunning ? 'destructive' : 'default'}
                      onClick={() => setIsRunning(!isRunning)}
                      className={isRunning ? '' : 'bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20'}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="mr-2 size-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 size-4" />
                          Start Optimization
                        </>
                      )}
                    </Button>
                    <Button variant="outline" disabled={isRunning} className="border-border/60">
                      <RotateCcw className="mr-2 size-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Optimization Progress</span>
                      <span className="text-foreground font-semibold">
                        Iteration {currentIteration.toLocaleString()} / {config.maxIterations.toLocaleString()}
                      </span>
                    </div>                    
                    <Progress value={progress} className="h-3" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Best Cost', value: '0', color: 'text-chart-1', bgColor: 'bg-chart-1/10', borderColor: 'border-chart-1/20' },
                      { label: 'Current Cost', value: '0', color: 'text-chart-2', bgColor: 'bg-chart-2/10', borderColor: 'border-chart-2/20' },
                      { label: 'Temperature', value: config.initialTemperature.toExponential(0), color: 'text-chart-4', bgColor: 'bg-chart-4/10', borderColor: 'border-chart-4/20' },
                      { label: 'Hard Violations', value: '0', color: 'text-destructive', bgColor: 'bg-destructive/10', borderColor: 'border-destructive/20' },
                      { label: 'Soft Violations', value: '0', color: 'text-chart-3', bgColor: 'bg-chart-3/10', borderColor: 'border-chart-3/20' },
                      { label: 'Tabu Hits', value: '0', color: 'text-chart-5', bgColor: 'bg-chart-5/10', borderColor: 'border-chart-5/20' },
                    ].map((stat) => (
                      <div 
                        key={stat.label}
                        className={`p-4 rounded-xl border ${stat.borderColor} ${stat.bgColor} transition-all duration-200 hover:scale-[1.02]`}
                      >
                        <div className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-3">
              {/* Parameters Panel */}
              <div className="space-y-4 xl:col-span-1">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
                        <Settings2 className="size-4 text-chart-1" />
                      </div>
                      <CardTitle className="text-base">Algorithm Parameters</CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Core SA Parameters */}
                    <Collapsible open={expandedSections.core} onOpenChange={() => toggleSection('core')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                        <span className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-chart-4/10">
                            <Flame className="size-4 text-chart-4" />
                          </div>
                          Core SA Parameters
                        </span>
                        {expandedSections.core ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Initial Temperature</Label>
                              <Input
                                type="number"
                                value={config.initialTemperature}
                                onChange={(e) => updateConfig('initialTemperature', Number(e.target.value))}
                                className="h-8 w-28 text-xs bg-secondary/50 border-border/60"
                                disabled={isRunning}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Min Temperature</Label>
                              <Input
                                type="number"
                                value={config.minTemperature}
                                onChange={(e) => updateConfig('minTemperature', Number(e.target.value))}
                                className="h-8 w-28 text-xs bg-secondary/50 border-border/60"
                                disabled={isRunning}
                                step="0.0000001"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Cooling Rate</Label>
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.coolingRate}</span>
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

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Max Iterations</Label>
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.maxIterations.toLocaleString()}</span>
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
                              <Label className="text-xs font-medium">Hard Constraint Weight</Label>
                              <Input
                                type="number"
                                value={config.hardConstraintWeight}
                                onChange={(e) => updateConfig('hardConstraintWeight', Number(e.target.value))}
                                className="h-8 w-28 text-xs bg-secondary/50 border-border/60"
                                disabled={isRunning}
                              />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Reheating Configuration */}
                    
                    <Collapsible open={expandedSections.reheating} onOpenChange={() => toggleSection('reheating')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                        <span className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/10">
                            <Zap className="size-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          Reheating
                        </span>
                        {expandedSections.reheating ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Reheating Threshold</Label>
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.reheatingThreshold}</span>
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

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Reheating Factor</Label>
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.reheatingFactor}</span>
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

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Max Reheats</Label>
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.maxReheats}</span>
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
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Tabu Search Configuration */}
                    
                    <Collapsible open={expandedSections.tabu} onOpenChange={() => toggleSection('tabu')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                        <span className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-chart-5/10">
                            <ListX className="size-4 text-chart-5" />
                          </div>
                          Tabu Search
                        </span>
                        {expandedSections.tabu ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <Label className="text-sm font-medium">Enable Tabu Search</Label>
                          <Switch
                            checked={config.tabuSearchEnabled}
                            onCheckedChange={(v) => updateConfig('tabuSearchEnabled', v)}
                            disabled={isRunning}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                        
                        {config.tabuSearchEnabled && (
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Tabu Tenure</Label>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.tabuTenure}</span>
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

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Max Tabu List Size</Label>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.maxTabuListSize.toLocaleString()}</span>
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

                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <Label className="text-sm font-medium">Aspiration Enabled</Label>
                              <Switch
                                checked={config.aspirationEnabled}
                                onCheckedChange={(v) => updateConfig('aspirationEnabled', v)}
                                disabled={isRunning}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator />

                    {/* Intensification Configuration */}
                    
                    <Collapsible open={expandedSections.intensification} onOpenChange={() => toggleSection('intensification')}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium hover:bg-muted transition-colors">
                        <span className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-chart-1/10">
                            <Zap className="size-4 text-chart-1" />
                          </div>
                          Intensification
                        </span>
                        {expandedSections.intensification ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <Label className="text-sm font-medium">Enable Intensification</Label>
                          <Switch
                            checked={config.enableIntensification}
                            onCheckedChange={(v) => updateConfig('enableIntensification', v)}
                            disabled={isRunning}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                        
                        {config.enableIntensification && (
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Intensification Iterations</Label>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.intensificationIterations.toLocaleString()}</span>
                              </div>                              
                              <Slider
                                value={[config.intensificationIterations]}
                                onValueChange={([v]) => updateConfig('intensificationIterations', v)}
                                min={500}
                                max={10000}
                                step={500}
                                disabled={isRunning}
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">Max Attempts</Label>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{config.maxIntensificationAttempts}</span>
                              </div>                              
                              <Slider
                                value={[config.maxIntensificationAttempts]}
                                onValueChange={([v]) => updateConfig('maxIntensificationAttempts', v)}
                                min={1}
                                max={10}
                                step={1}
                                disabled={isRunning}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium">Operator Selection Mode</Label>                              
                              <Select
                                value={config.operatorSelectionMode}
                                onValueChange={(v) => updateConfig('operatorSelectionMode', v as SAConfig['operatorSelectionMode'])}
                                disabled={isRunning}
                              >
                                <SelectTrigger className="h-9 text-sm bg-secondary/50 border-border/60">
                                  <SelectValue />
                                </SelectTrigger>                                
                                <SelectContent>
                                  <SelectItem value="adaptive">Adaptive</SelectItem>
                                  <SelectItem value="random">Random</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Panel */}
              
              <div className="space-y-4 xl:col-span-2">
                <Tabs defaultValue="cost" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
                    <TabsTrigger value="cost" className="data-[state=active]:bg-card">Cost</TabsTrigger>
                    <TabsTrigger value="temperature" className="data-[state=active]:bg-card">Temperature</TabsTrigger>
                    <TabsTrigger value="violations" className="data-[state=active]:bg-card">Violations</TabsTrigger>
                    <TabsTrigger value="tabu" className="data-[state=active]:bg-card">Tabu</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cost" className="mt-4">
                    {selectedResult ? (
                      <SACostChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[350px] items-center justify-center border-border/60">
                        <p className="text-muted-foreground">Select a result to view charts</p>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="temperature" className="mt-4">
                    {selectedResult ? (
                      <TemperatureChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[350px] items-center justify-center border-border/60">
                        <p className="text-muted-foreground">Select a result to view charts</p>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="violations" className="mt-4">
                    {selectedResult ? (
                      <ViolationsChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[350px] items-center justify-center border-border/60">
                        <p className="text-muted-foreground">Select a result to view charts</p>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="tabu" className="mt-4">
                    {selectedResult ? (
                      <TabuChart data={selectedResult.history} />
                    ) : (
                      <Card className="flex h-[350px] items-center justify-center border-border/60">
                        <p className="text-muted-foreground">Select a result to view charts</p>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Selected Result Summary */}
                
                {selectedResult && (
                  <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{selectedResult.name}</CardTitle>                        
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {selectedResult.status}
                        </Badge>
                      </div>
                    </CardHeader>                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Accepted Moves', value: selectedResult.metrics.acceptedMoves.toLocaleString() },
                          { label: 'Rejected Moves', value: selectedResult.metrics.rejectedMoves.toLocaleString() },
                          { label: 'Total Reheats', value: selectedResult.metrics.totalReheats },
                          { label: 'Convergence At', value: selectedResult.metrics.convergenceIteration > 0 ? selectedResult.metrics.convergenceIteration.toLocaleString() : 'N/A' },
                        ].map((metric) => (
                          <div key={metric.label} className="p-3 rounded-xl bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>                            
                            <div className="text-lg font-semibold text-foreground">{metric.value}</div>
                          </div>
                        ))}
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