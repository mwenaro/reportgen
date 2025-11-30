'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Alert,
  AlertDescription,
  Progress,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  LoadingSpinner
} from '@/components'
import { useCreateClass } from '@/lib/store/classes'
import { CreateClassData } from '@/lib/types'
import { exportToCSV } from '@/lib/utils'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Users
} from 'lucide-react'

interface ImportError {
  row: number
  field: string
  message: string
}

interface ImportResult {
  success: boolean
  imported: number
  errors: ImportError[]
  duplicates: number
}

export default function ClassImportPage() {
  const router = useRouter()
  const createClass = useCreateClass()
  
  const [file, setFile] = React.useState<File | null>(null)
  const [importing, setImporting] = React.useState(false)
  const [result, setResult] = React.useState<ImportResult | null>(null)
  const [preview, setPreview] = React.useState<any[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = async (file: File) => {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    const data = lines.slice(1, 6).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const row: any = { _rowIndex: index + 2 }
      headers.forEach((header, i) => {
        row[header] = values[i] || ''
      })
      return row
    })
    
    setPreview(data)
  }

  const validateRow = (row: any, rowIndex: number): ImportError[] => {
    const errors: ImportError[] = []
    
    if (!row['Class Name']?.trim()) {
      errors.push({ row: rowIndex, field: 'Class Name', message: 'Class name is required' })
    }
    
    if (!row['Level']?.trim()) {
      errors.push({ row: rowIndex, field: 'Level', message: 'Level is required' })
    }
    
    if (!row['Section']?.trim()) {
      errors.push({ row: rowIndex, field: 'Section', message: 'Section is required' })
    }
    
    if (!row['Capacity']?.trim() || isNaN(parseInt(row['Capacity']))) {
      errors.push({ row: rowIndex, field: 'Capacity', message: 'Valid capacity number is required' })
    } else {
      const capacity = parseInt(row['Capacity'])
      if (capacity < 1 || capacity > 100) {
        errors.push({ row: rowIndex, field: 'Capacity', message: 'Capacity must be between 1 and 100' })
      }
    }
    
    if (!row['Academic Year']?.trim()) {
      errors.push({ row: rowIndex, field: 'Academic Year', message: 'Academic year is required' })
    }
    
    return errors
  }

  const handleImport = async () => {
    if (!file) return
    
    setImporting(true)
    
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const rows = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim())
        const row: any = { _rowIndex: index + 2 }
        headers.forEach((header, i) => {
          row[header] = values[i] || ''
        })
        return row
      })
      
      const allErrors: ImportError[] = []
      const validRows: CreateClassData[] = []
      
      // Validate all rows
      rows.forEach((row, index) => {
        const errors = validateRow(row, row._rowIndex)
        allErrors.push(...errors)
        
        if (errors.length === 0) {
          validRows.push({
            name: row['Class Name'],
            level: row['Level'],
            section: row['Section'],
            description: row['Description'] || '',
            capacity: parseInt(row['Capacity']),
            currentEnrollment: parseInt(row['Current Enrollment']) || 0,
            academicYear: row['Academic Year'],
            classTeacherId: row['Teacher ID'] || undefined,
            subjects: row['Subjects'] ? row['Subjects'].split(';').map((s: string) => s.trim()) : [],
            room: row['Room'] || '',
            isActive: row['Status']?.toLowerCase() !== 'inactive',
            schedule: {
              startTime: row['Start Time'] || '08:00',
              endTime: row['End Time'] || '15:00',
              daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
          })
        }
      })
      
      // Import valid rows
      let imported = 0
      for (const classData of validRows) {
        try {
          await createClass.mutateAsync(classData)
          imported++
        } catch (error) {
          allErrors.push({
            row: rows.findIndex(r => r['Class Name'] === classData.name) + 2,
            field: 'general',
            message: 'Failed to create class'
          })
        }
      }
      
      setResult({
        success: allErrors.length === 0,
        imported,
        errors: allErrors,
        duplicates: 0
      })
      
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, field: 'file', message: 'Failed to process file' }],
        duplicates: 0
      })
    }
    
    setImporting(false)
  }

  const downloadTemplate = () => {
    const template = [
      {
        'Class Name': 'Grade 5A Mathematics',
        'Level': 'Grade 5',
        'Section': 'A',
        'Description': 'Advanced mathematics class',
        'Capacity': '30',
        'Current Enrollment': '25',
        'Academic Year': '2024/2025',
        'Teacher ID': '',
        'Subjects': 'Mathematics;Science',
        'Room': 'Room 101',
        'Start Time': '08:00',
        'End Time': '15:00',
        'Status': 'Active'
      },
      {
        'Class Name': 'Grade 6B Science',
        'Level': 'Grade 6',
        'Section': 'B',
        'Description': 'Comprehensive science program',
        'Capacity': '25',
        'Current Enrollment': '22',
        'Academic Year': '2024/2025',
        'Teacher ID': '',
        'Subjects': 'Biology;Chemistry;Physics',
        'Room': 'Science Lab A',
        'Start Time': '08:30',
        'End Time': '15:30',
        'Status': 'Active'
      }
    ]
    
    exportToCSV(template, 'class-import-template.csv')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Import Classes</h1>
              <p className="text-muted-foreground">
                Bulk import classes from CSV file
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Import Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Required Fields:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Class Name</li>
                    <li>• Level</li>
                    <li>• Section</li>
                    <li>• Capacity (1-100)</li>
                    <li>• Academic Year</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Optional Fields:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Description</li>
                    <li>• Current Enrollment</li>
                    <li>• Teacher ID</li>
                    <li>• Subjects (semicolon separated)</li>
                    <li>• Room</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your CSV file uses comma separators and follows the template format.
                  Download the template above for reference.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV files only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    size="sm"
                  >
                    {importing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Classes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {preview.length > 0 && !result && (
          <Card>
            <CardHeader>
              <CardTitle>Preview (First 5 rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, index) => {
                      const errors = validateRow(row, row._rowIndex)
                      const hasErrors = errors.length > 0
                      
                      return (
                        <TableRow key={index} className={hasErrors ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{row._rowIndex}</span>
                              {hasErrors ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={!row['Class Name'] ? 'text-red-600' : ''}>
                            {row['Class Name'] || <span className="italic">Missing</span>}
                          </TableCell>
                          <TableCell className={!row['Level'] ? 'text-red-600' : ''}>
                            {row['Level'] || <span className="italic">Missing</span>}
                          </TableCell>
                          <TableCell className={!row['Section'] ? 'text-red-600' : ''}>
                            {row['Section'] || <span className="italic">Missing</span>}
                          </TableCell>
                          <TableCell className={!row['Capacity'] || isNaN(parseInt(row['Capacity'])) ? 'text-red-600' : ''}>
                            {row['Capacity'] || <span className="italic">Missing</span>}
                          </TableCell>
                          <TableCell className={!row['Academic Year'] ? 'text-red-600' : ''}>
                            {row['Academic Year'] || <span className="italic">Missing</span>}
                          </TableCell>
                          <TableCell>
                            <Badge variant={hasErrors ? 'destructive' : 'default'}>
                              {hasErrors ? 'Invalid' : 'Valid'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.imported}
                    </div>
                    <div className="text-sm text-muted-foreground">Classes Imported</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {result.errors.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.duplicates}
                    </div>
                    <div className="text-sm text-muted-foreground">Duplicates Skipped</div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Errors Found:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Row {error.row}, {error.field}:</strong> {error.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button onClick={() => router.push('/classes')}>
                    <Users className="h-4 w-4 mr-2" />
                    View Classes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null)
                      setResult(null)
                      setPreview([])
                    }}
                  >
                    Import Another File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}