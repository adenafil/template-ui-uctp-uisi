import { useState } from 'react'
import {
  Play,
  Trash2,
  Download,
  Check,
  MoreHorizontal,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  StopCircle,
  Loader2,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OptimizationResult } from '@/lib/optimization-types'

interface ResultsTableProps {
  results: OptimizationResult[]
  onSelect?: (result: OptimizationResult) => void
  onDelete?: (ids: string[]) => void
  onRerun?: (result: OptimizationResult) => void
  onExport?: (results: OptimizationResult[], format: 'csv' | 'json') => void
  selectedId?: string
}

export function ResultsTable({
  results,
  onSelect,
  onDelete,
  onRerun,
  onExport,
  selectedId,
}: ResultsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const toggleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(results.map((r) => r.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete?.([itemToDelete])
      setItemToDelete(null)
    } else if (selectedIds.length > 0) {
      onDelete?.(selectedIds)
      setSelectedIds([])
    }
    setDeleteDialogOpen(false)
  }

  const handleExport = (format: 'csv' | 'json') => {
    const toExport =
      selectedIds.length > 0
        ? results.filter((r) => selectedIds.includes(r.id))
        : results
    onExport?.(toExport, format)
  }

  const getStatusBadge = (status: OptimizationResult['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="border-success/50 bg-success/10 text-success">
            <CheckCircle2 className="mr-1 size-3" />
            Completed
          </Badge>
        )
      case 'running':
        return (
          <Badge variant="outline" className="border-chart-1/50 bg-chart-1/10 text-chart-1">
            <Loader2 className="mr-1 size-3 animate-spin" />
            Running
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="border-destructive/50 bg-destructive/10 text-destructive">
            <XCircle className="mr-1 size-3" />
            Failed
          </Badge>
        )
      case 'stopped':
        return (
          <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning">
            <StopCircle className="mr-1 size-3" />
            Stopped
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Optimization Results</CardTitle>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete ({selectedIds.length})
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 size-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileJson className="mr-2 size-4" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="mr-2 size-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedIds.length === results.length && results.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Improvement</TableHead>
                <TableHead className="text-right">Violations</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className={
                    selectedId === result.id
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : 'hover:bg-muted/50'
                  }
                  onClick={() => onSelect?.(result)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(result.id)}
                      onCheckedChange={() => toggleSelect(result.id)}
                      aria-label={`Select ${result.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(result.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {result.metrics.finalCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-success">
                      {result.metrics.improvement.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={
                          result.metrics.hardViolations > 0
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }
                      >
                        H:{result.metrics.hardViolations}
                      </span>
                      <span className="text-muted-foreground">
                        S:{result.metrics.softViolations}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {result.metrics.duration}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelect?.(result)}>
                          <Check className="mr-2 size-4" />
                          Select
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRerun?.(result)}>
                          <Play className="mr-2 size-4" />
                          Rerun
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setItemToDelete(result.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No optimization results yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              {itemToDelete
                ? 'this optimization result'
                : `${selectedIds.length} optimization result(s)`}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
