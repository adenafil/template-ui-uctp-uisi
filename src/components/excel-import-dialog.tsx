import { useState, useRef, useCallback } from 'react'
import { FileSpreadsheet, Upload, Download, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface RequiredField {
  name: string
  description?: string
  example?: string
}

export interface ExcelImportDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  requiredFields: RequiredField[]
  sheetName: string
  onImport: (file: File, overwrite: boolean) => void
  onDownloadTemplate: () => void
  previewData?: Record<string, string | number | boolean>[]
  isLoading?: boolean
}

export function ExcelImportDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  requiredFields,
  sheetName,
  onImport,
  onDownloadTemplate,
  previewData,
  isLoading = false,
}: ExcelImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleImport = useCallback(() => {
    if (selectedFile) {
      onImport(selectedFile, overwriteExisting)
    }
  }, [selectedFile, overwriteExisting, onImport])

  const handleClose = useCallback(() => {
    setSelectedFile(null)
    setOverwriteExisting(false)
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-chart-2" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Required Fields Info */}
            <div className="rounded-lg border border-chart-4/20 bg-chart-4/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-chart-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-chart-4 mb-2">Required Fields</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {requiredFields.map((field) => (
                      <div key={field.name} className="flex flex-col">
                        <span className="font-semibold text-foreground">{field.name}</span>
                        {field.description && (
                          <span className="text-xs text-muted-foreground">{field.description}</span>
                        )}
                        {field.example && (
                          <span className="text-xs text-chart-4">Ex: {field.example}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Template Download */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-chart-2/10">
                  <Download className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm font-medium">Download Template</p>
                  <p className="text-xs text-muted-foreground">
                    Get the correct format for {sheetName}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
                <Download className="mr-2 h-3 w-3" />
                Template
              </Button>
            </div>

            {/* File Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200
                ${isDragging 
                  ? 'border-chart-2 bg-chart-2/5 scale-[1.02]' 
                  : 'border-border hover:border-chart-2/50 hover:bg-muted/30'
                }
                ${selectedFile ? 'bg-chart-2/5 border-chart-2/50' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-chart-2/20">
                    <CheckCircle className="h-8 w-8 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Drop your Excel file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports .xlsx and .xls files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Overwrite Checkbox */}
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-chart-3/5 border border-chart-3/20">
              <Checkbox
                id="overwrite"
                checked={overwriteExisting}
                onCheckedChange={(checked) => setOverwriteExisting(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="overwrite"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Overwrite existing data
                </Label>
                <p className="text-xs text-muted-foreground">
                  {overwriteExisting 
                    ? 'All existing data will be replaced with the imported data.' 
                    : 'New data will be added to existing data.'}
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {previewData && previewData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Preview</h4>
                  <Badge variant="secondary">
                    {previewData.length} rows
                  </Badge>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(previewData[0]).map((key) => (
                          <TableHead key={key} className="text-xs">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 5).map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((value, vIdx) => (
                            <TableCell key={vIdx} className="text-xs">
                              {String(value).length > 30 
                                ? String(value).substring(0, 30) + '...' 
                                : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {previewData.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Showing 5 of {previewData.length} rows
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-chart-2 to-chart-2/90 hover:opacity-90"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Importing...
              </>
            ) : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
