import * as React from "react"
import { ChevronLeft, ChevronRight, Trash2, ChevronFirst, ChevronLast } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface DataTableColumn<T> {
  key: string
  header: React.ReactNode
  cell: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: DataTableColumn<T>[]
  rowActions?: (item: T) => React.ReactNode
  onDeleteItems?: (ids: string[]) => void
  defaultRowsPerPage?: number
  className?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  rowActions,
  onDeleteItems,
  defaultRowsPerPage = 25,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, data.length)
  const currentData = data.slice(startIndex, endIndex)

  const selectedOnPage = currentData.filter((item) => selectedItems.has(item.id))
  const allSelectedOnPage = currentData.length > 0 && selectedOnPage.length === currentData.length
  const someSelectedOnPage = selectedOnPage.length > 0 && selectedOnPage.length < currentData.length
  const totalSelected = selectedItems.size

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [data.length, rowsPerPage, currentPage, totalPages])

  const handleSelectAllOnPage = () => {
    const newSelected = new Set(selectedItems)
    if (allSelectedOnPage) {
      currentData.forEach((item) => newSelected.delete(item.id))
    } else {
      currentData.forEach((item) => newSelected.add(item.id))
    }
    setSelectedItems(newSelected)
  }

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleSelectAllData = () => {
    const newSelected = new Set(data.map((item) => item.id))
    setSelectedItems(newSelected)
  }

  const handleClearSelection = () => {
    setSelectedItems(new Set())
  }

  const handleDeleteSelected = () => {
    if (onDeleteItems && totalSelected > 0) {
      onDeleteItems(Array.from(selectedItems))
      setSelectedItems(new Set())
    }
    setShowDeleteDialog(false)
  }

  const handleRowsPerPageChange = (value: string) => {
    const newRowsPerPage = parseInt(value, 10)
    setRowsPerPage(newRowsPerPage)
    setCurrentPage(1)
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goToNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  const showPagination = data.length > 10
  const showBulkActions = totalSelected > 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {totalSelected} selected
            </span>
            {totalSelected < data.length && (
              <button
                onClick={handleSelectAllData}
                className="text-sm text-primary hover:underline"
              >
                Select all {data.length} items
              </button>
            )}
            {totalSelected === data.length && (
              <button
                onClick={handleClearSelection}
                className="text-sm text-muted-foreground hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Selected Items</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {totalSelected} selected items? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSelected}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete {totalSelected} Items
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {onDeleteItems && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelectedOnPage}
                    data-state={someSelectedOnPage ? "indeterminate" : allSelectedOnPage ? "checked" : "unchecked"}
                    onCheckedChange={handleSelectAllOnPage}
                    aria-label="Select all on page"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {rowActions && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onDeleteItems ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "group border-border/50 hover:bg-muted/30 transition-colors duration-200",
                    selectedItems.has(item.id) && "bg-muted/50"
                  )}
                  data-state={selectedItems.has(item.id) ? "selected" : undefined}
                >
                  {onDeleteItems && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        aria-label={`Select item ${item.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rowActions(item)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{endIndex} of {data.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
