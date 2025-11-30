'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Alert,
  AlertDescription,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTransition
} from '@/components'
import { useImportSubjects, useSubjects } from '@/lib/store/subjects'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react'
import { toast } from 'sonner'

interface ImportData {
  name: string
  code: string
  description?: string
  department?: string
  level?: string
  credits: number
  isActive: boolean
}

interface ValidationError {
  row: number
  field: string
  message: string
}

interface ImportResult {
  success: boolean
  data?: ImportData[]
  errors?: ValidationError[]
  total?: number
  processed?: number
}

export default function ImportSubjectsPage() {
  const router = useRouter()
  const [importProgress, setImportProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [validatedData, setValidatedData] = useState<ImportData[]>([])
  
  const importSubjects = useImportSubjects()
  const { data: existingSubjects = [] } = useSubjects()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    onDrop: handleFileUpload
  })

  async function handleFileUpload(files: File[]) {
    if (files.length === 0) return

    const file = files[0]
    setIsProcessing(true)
    setImportProgress(0)

    try {
      const text = await file.text()
      const result = parseCSV(text)
      
      if (result.success && result.data) {
        setValidatedData(result.data)
        setImportResult(result)
        toast.success(`${result.data.length} subjects validated successfully`)
      } else {
        setImportResult(result)
        toast.error('Validation failed. Please check the errors.')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to process file. Please try again.')
      setImportResult({
        success: false,
        errors: [{ row: 0, field: 'file', message: 'Failed to read file' }]
      })
    } finally {
      setIsProcessing(false)
      setImportProgress(100)
    }
  }

  function parseCSV(text: string): ImportResult {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      return {
        success: false,
        errors: [{ row: 0, field: 'file', message: 'File must contain header and at least one data row' }]
      }
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const requiredFields = ['name', 'code', 'credits']
    const missingFields = requiredFields.filter(field => !headers.includes(field))

    if (missingFields.length > 0) {
      return {
        success: false,
        errors: [{ 
          row: 0, 
          field: 'headers', 
          message: `Missing required columns: ${missingFields.join(', ')}` 
        }]
      }
    }

    const data: ImportData[] = []
    const errors: ValidationError[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })

      // Validation
      const rowNumber = i + 1

      if (!row.name) {
        errors.push({ row: rowNumber, field: 'name', message: 'Name is required' })
      }

      if (!row.code) {
        errors.push({ row: rowNumber, field: 'code', message: 'Code is required' })
      } else if (existingSubjects.some(s => s.code.toLowerCase() === row.code.toLowerCase())) {
        errors.push({ row: rowNumber, field: 'code', message: `Code '${row.code}' already exists` })
      }

      const credits = parseInt(row.credits)
      if (!credits || credits < 1 || credits > 10) {
        errors.push({ row: rowNumber, field: 'credits', message: 'Credits must be between 1 and 10' })
      }

      // If no errors for this row, add to data
      if (!errors.some(error => error.row === rowNumber)) {
        data.push({
          name: row.name,
          code: row.code,
          description: row.description || '',
          department: row.department || '',
          level: row.level || '',
          credits: credits,
          isActive: row.isactive?.toLowerCase() !== 'false'
        })
      }
    }

    return {
      success: errors.length === 0,
      data,
      errors,
      total: lines.length - 1,
      processed: data.length
    }
  }

  const handleConfirmImport = async () => {
    if (!validatedData.length) return

    setIsProcessing(true)
    setImportProgress(0)

    try {
      const progressIncrement = 100 / validatedData.length

      for (let i = 0; i < validatedData.length; i++) {
        const subjectData = validatedData[i]
        
        await importSubjects.mutateAsync({
          ...subjectData,
          id: `subject_${Date.now()}_${i}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

        setImportProgress((i + 1) * progressIncrement)
      }

      toast.success(`Successfully imported ${validatedData.length} subjects`)
      router.push('/subjects')
      router.refresh()
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Failed to import subjects. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const headers = ['name', 'code', 'description', 'department', 'level', 'credits', 'isActive']
    const sampleData = [
      'Advanced Mathematics,MATH301,Advanced mathematical concepts,Mathematics,High School,3,true',
      'Physics Fundamentals,PHYS101,Introduction to physics,Science,Foundation,2,true',
      'English Literature,ENG201,Study of literary works,English,Middle School,2,true'
    ]
    
    const csvContent = [headers.join(','), ...sampleData].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'subjects-import-template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
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
            <h1 className="text-3xl font-bold">Import Subjects</h1>
            <p className="text-muted-foreground">
              Import subjects from CSV or Excel files
            </p>
          </div>
        </div>
        <Button onClick={downloadTemplate} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input {...getInputProps()} />
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p className="text-primary font-medium">Drop the file here...</p>
                ) : (
                  <>
                    <p className="font-medium mb-2">
                      Drop your CSV or Excel file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports CSV, XLS, and XLSX files up to 10MB
                    </p>
                  </>
                )}
              </div>

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span>Import Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList>
                    <TabsTransition value="summary">Summary</TabsTransition>
                    {importResult.data && importResult.data.length > 0 && (
                      <TabsTransition value="data">Data Preview</TabsTransition>
                    )}
                    {importResult.errors && importResult.errors.length > 0 && (
                      <TabsTransition value="errors">Errors</TabsTransition>
                    )}
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {importResult.total || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Rows</div>
                      </div>
                      <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {importResult.processed || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Valid Records</div>
                      </div>
                    </div>

                    {importResult.success ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          All records validated successfully! You can now proceed with the import.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {importResult.errors?.length || 0} validation errors found. 
                          Please fix the errors and try again.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  {importResult.data && importResult.data.length > 0 && (
                    <TabsContent value="data">
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Code</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Credits</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {importResult.data.slice(0, 10).map((subject, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell>{subject.code}</TableCell>
                                <TableCell>{subject.department || 'N/A'}</TableCell>
                                <TableCell>{subject.credits}</TableCell>
                                <TableCell>
                                  <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                                    {subject.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        {importResult.data.length > 10 && (
                          <div className="p-4 text-center text-sm text-muted-foreground border-t">
                            Showing first 10 of {importResult.data.length} records
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}

                  {importResult.errors && importResult.errors.length > 0 && (
                    <TabsContent value="errors">
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Row {error.row}, Column {error.field}: {error.message}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {importResult.success && validatedData.length > 0 && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleConfirmImport}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Import {validatedData.length} Subjects
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                File Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <code>name</code> - Subject name</li>
                  <li>• <code>code</code> - Unique subject code</li>
                  <li>• <code>credits</code> - Credit hours (1-10)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Optional Columns:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <code>description</code> - Subject description</li>
                  <li>• <code>department</code> - Academic department</li>
                  <li>• <code>level</code> - Academic level</li>
                  <li>• <code>isActive</code> - Active status (true/false)</li>
                </ul>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure subject codes are unique and don't conflict with existing subjects.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use the template for correct formatting</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensure all required fields are filled</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Subject codes must be unique</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Credits should be between 1-10</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>File size should be under 10MB</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}