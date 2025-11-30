'use client'

import React from 'react'
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { 
  Button, 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  LoadingSpinner,
  useNotify
} from '@/components'
import { useBulkCreateStudents } from '@/lib/store/students'
import { useClasses } from '@/lib/store/classes'
import { Student } from '@/lib/types'
import { generateAdmissionNumber, cn } from '@/lib/utils'

interface StudentImportProps {
  onSuccess: (count: number) => void
  onCancel: () => void
}

interface ImportPreview {
  data: any[]
  errors: ImportError[]
  warnings: ImportWarning[]
}

interface ImportError {
  row: number
  field: string
  message: string
  value: any
}

interface ImportWarning {
  row: number
  field: string
  message: string
  value: any
}

export function StudentImport({ onSuccess, onCancel }: StudentImportProps) {
  const notify = useNotify()
  const [step, setStep] = React.useState<'upload' | 'preview' | 'importing'>('upload')
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<ImportPreview | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  
  const bulkCreateStudents = useBulkCreateStudents()
  const { data: classes = [] } = useClasses()

  // Create class lookup map
  const classLookup = React.useMemo(() => {
    const lookup: Record<string, string> = {}
    classes.forEach(cls => {
      lookup[cls.name.toLowerCase()] = cls.id
    })
    return lookup
  }, [classes])

  // Sample CSV template
  const csvTemplate = [
    'Full Name,Admission Number,Email,Phone,Date of Birth,Gender,Class,KCPE Marks,Guardian Name,Guardian Relationship,Guardian Phone,Guardian Email,Address,Medical Info,Notes',
    'John Doe,,john.doe@email.com,+254700000001,2010-05-15,male,Form 1A,350,Jane Doe,mother,+254700000002,jane.doe@email.com,"123 Main St, Nairobi",None,Good student',
    'Mary Smith,STD/2024/002,mary.smith@email.com,+254700000003,2009-08-22,female,Form 2B,380,Peter Smith,father,+254700000004,peter.smith@email.com,"456 Oak Ave, Mombasa",Asthma,Excellent performance',
  ].join('\n')

  // Download template
  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    notify.success('Template downloaded successfully')
  }

  // Handle drag events
  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }, [])

  // Handle file selection
  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile) return

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx?)$/i)) {
      notify.error('Please select a valid CSV or Excel file')
      return
    }

    setFile(selectedFile)
    processFile(selectedFile)
  }

  // Process uploaded file
  const processFile = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        notify.error('File must contain header row and at least one data row')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })

      const preview = validateData(rows)
      setPreview(preview)
      setStep('preview')
    } catch (error) {
      console.error('Error processing file:', error)
      notify.error('Failed to process file')
    }
  }

  // Validate imported data
  const validateData = (rows: Record<string, string>[]): ImportPreview => {
    const errors: ImportError[] = []
    const warnings: ImportWarning[] = []
    const validData: any[] = []

    rows.forEach((row, index) => {
      const rowNumber = index + 2 // Account for header row
      const studentData: any = {}

      // Required fields validation
      if (!row['Full Name'] || row['Full Name'].trim().length < 2) {
        errors.push({
          row: rowNumber,
          field: 'Full Name',
          message: 'Full name is required and must be at least 2 characters',
          value: row['Full Name']
        })
      } else {
        studentData.name = row['Full Name'].trim()
      }

      // Admission number
      studentData.admissionNumber = row['Admission Number']?.trim() || generateAdmissionNumber()

      // Email validation
      if (row['Email']) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(row['Email'])) {
          errors.push({
            row: rowNumber,
            field: 'Email',
            message: 'Invalid email format',
            value: row['Email']
          })
        } else {
          studentData.email = row['Email'].trim()
        }
      }

      // Phone validation
      if (row['Phone']) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/
        if (!phoneRegex.test(row['Phone'])) {
          warnings.push({
            row: rowNumber,
            field: 'Phone',
            message: 'Invalid phone format',
            value: row['Phone']
          })
        } else {
          studentData.phone = row['Phone'].trim()
        }
      }

      // Date of birth
      if (!row['Date of Birth']) {
        errors.push({
          row: rowNumber,
          field: 'Date of Birth',
          message: 'Date of birth is required',
          value: row['Date of Birth']
        })
      } else {
        const birthDate = new Date(row['Date of Birth'])
        if (isNaN(birthDate.getTime())) {
          errors.push({
            row: rowNumber,
            field: 'Date of Birth',
            message: 'Invalid date format (use YYYY-MM-DD)',
            value: row['Date of Birth']
          })
        } else {
          const age = new Date().getFullYear() - birthDate.getFullYear()
          if (age < 3 || age > 25) {
            warnings.push({
              row: rowNumber,
              field: 'Date of Birth',
              message: 'Student age should be between 3 and 25 years',
              value: row['Date of Birth']
            })
          }
          studentData.dateOfBirth = birthDate
        }
      }

      // Gender
      if (!row['Gender'] || !['male', 'female'].includes(row['Gender'].toLowerCase())) {
        errors.push({
          row: rowNumber,
          field: 'Gender',
          message: 'Gender must be either "male" or "female"',
          value: row['Gender']
        })
      } else {
        studentData.gender = row['Gender'].toLowerCase()
      }

      // Class validation
      if (!row['Class']) {
        errors.push({
          row: rowNumber,
          field: 'Class',
          message: 'Class is required',
          value: row['Class']
        })
      } else {
        const classId = classLookup[row['Class'].toLowerCase()]
        if (!classId) {
          errors.push({
            row: rowNumber,
            field: 'Class',
            message: `Class "${row['Class']}" not found. Available classes: ${classes.map(c => c.name).join(', ')}`,
            value: row['Class']
          })
        } else {
          studentData.classId = classId
        }
      }

      // KCPE Marks
      if (row['KCPE Marks']) {
        const marks = parseInt(row['KCPE Marks'])
        if (isNaN(marks) || marks < 0 || marks > 500) {
          warnings.push({
            row: rowNumber,
            field: 'KCPE Marks',
            message: 'KCPE marks should be between 0 and 500',
            value: row['KCPE Marks']
          })
        } else {
          studentData.kcpeMarks = marks
        }
      }

      // Guardian information
      if (!row['Guardian Name'] || row['Guardian Name'].trim().length < 2) {
        errors.push({
          row: rowNumber,
          field: 'Guardian Name',
          message: 'Guardian name is required',
          value: row['Guardian Name']
        })
      }

      if (!row['Guardian Phone']) {
        errors.push({
          row: rowNumber,
          field: 'Guardian Phone',
          message: 'Guardian phone is required',
          value: row['Guardian Phone']
        })
      } else {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/
        if (!phoneRegex.test(row['Guardian Phone'])) {
          warnings.push({
            row: rowNumber,
            field: 'Guardian Phone',
            message: 'Invalid guardian phone format',
            value: row['Guardian Phone']
          })
        }
      }

      // Guardian email
      if (row['Guardian Email']) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(row['Guardian Email'])) {
          warnings.push({
            row: rowNumber,
            field: 'Guardian Email',
            message: 'Invalid guardian email format',
            value: row['Guardian Email']
          })
        }
      }

      // Build complete student data
      studentData.enrollmentDate = new Date()
      studentData.status = 'active'
      
      studentData.guardian = {
        name: row['Guardian Name']?.trim() || '',
        relationship: row['Guardian Relationship']?.toLowerCase() || 'guardian',
        phone: row['Guardian Phone']?.trim() || '',
        email: row['Guardian Email']?.trim() || undefined,
      }

      if (row['Address']) {
        const addressParts = row['Address'].split(',').map(p => p.trim())
        studentData.address = {
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          county: addressParts[2] || '',
          postalCode: '',
        }
      }

      studentData.medicalInfo = row['Medical Info']?.trim() || undefined
      studentData.notes = row['Notes']?.trim() || undefined

      validData.push(studentData)
    })

    return { data: validData, errors, warnings }
  }

  // Handle import
  const handleImport = async () => {
    if (!preview || preview.errors.length > 0) return

    setStep('importing')
    try {
      await bulkCreateStudents.mutateAsync(preview.data)
      onSuccess(preview.data.length)
    } catch (error) {
      console.error('Import failed:', error)
      notify.error('Import failed. Please try again.')
      setStep('preview')
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            step === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-green-100 text-green-800'
          )}>
            {step === 'upload' ? '1' : <CheckCircle className="h-4 w-4" />}
          </div>
          <div className="w-16 h-px bg-border"></div>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            step === 'preview' ? 'bg-primary text-primary-foreground' : 
            step === 'importing' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
          )}>
            {step === 'importing' ? <CheckCircle className="h-4 w-4" /> : '2'}
          </div>
          <div className="w-16 h-px bg-border"></div>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            step === 'importing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            3
          </div>
        </div>
      </div>

      {step === 'upload' && (
        <div className="space-y-4">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Step 1: Download Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the CSV template to ensure your data is formatted correctly.
              </p>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Step 2: Upload Your File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {file ? file.name : 'Drop your CSV file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports CSV and Excel files (.csv, .xlsx, .xls)
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelection(file)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Import Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Use the provided template to format your data correctly</p>
              <p>• Required fields: Full Name, Date of Birth, Gender, Class, Guardian Name, Guardian Phone</p>
              <p>• Date format should be YYYY-MM-DD (e.g., 2010-05-15)</p>
              <p>• Gender should be either "male" or "female"</p>
              <p>• Class names must match existing classes in your system</p>
              <p>• Phone numbers can include country codes and formatting</p>
              <p>• Admission numbers will be auto-generated if not provided</p>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'preview' && preview && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{preview.data.length}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{preview.errors.length}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{preview.warnings.length}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </CardContent>
            </Card>
          </div>

          {/* Errors */}
          {preview.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <X className="h-4 w-4" />
                  Errors ({preview.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {preview.errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded">
                      <Badge variant="destructive" className="text-xs">Row {error.row}</Badge>
                      <div className="flex-1">
                        <p className="font-medium text-red-800 dark:text-red-200">{error.field}</p>
                        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
                        {error.value && (
                          <p className="text-xs text-red-500 dark:text-red-500">Value: "{error.value}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {preview.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings ({preview.warnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {preview.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                      <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">Row {warning.row}</Badge>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">{warning.field}</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">{warning.message}</p>
                        {warning.value && (
                          <p className="text-xs text-yellow-500 dark:text-yellow-500">Value: "{warning.value}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('upload')}>
              Back to Upload
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={preview.errors.length > 0}
              >
                Import {preview.data.length} Students
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'importing' && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="xl" />
          <h3 className="text-lg font-medium mt-4">Importing Students...</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we process your data
          </p>
        </div>
      )}
    </div>
  )
}