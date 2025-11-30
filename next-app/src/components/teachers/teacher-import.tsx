'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Alert,
  LoadingSpinner
} from '@/components'
import { useCreateTeacher } from '@/lib/store/teachers'
import { Subject, Class, CreateTeacherData } from '@/lib/types'
import { exportToCSV } from '@/lib/utils'
import { Upload, Download, AlertCircle, CheckCircle, X, FileText } from 'lucide-react'

interface TeacherImportProps {
  subjects: Subject[]
  classes: Class[]
  onImportComplete: (successCount: number) => void
}

interface ImportResult {
  success: boolean
  row: number
  data?: CreateTeacherData
  errors: string[]
}

export function TeacherImport({ subjects, classes, onImportComplete }: TeacherImportProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [importResults, setImportResults] = React.useState<ImportResult[]>([])
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)

  const createTeacher = useCreateTeacher()

  const downloadTemplate = () => {
    const template = [
      {
        'Employee ID': 'EMP001',
        'Full Name': 'John Doe',
        'Email': 'john.doe@school.com',
        'Phone': '+254700123456',
        'Gender': 'male',
        'Date of Birth': '1985-03-15',
        'Address': 'Nairobi, Kenya',
        'Qualification': 'Bachelor of Education (Mathematics)',
        'Experience': '8 years',
        'Specialization': 'Secondary Mathematics',
        'Hire Date': '2020-01-15',
        'Contract Type': 'permanent',
        'Status': 'active',
        'Salary': '45000',
        'Subjects': 'math,physics',
        'Classes': 'form-1-a,form-2-b',
        'TSC Number': 'TSC123456',
        'ID Number': '12345678',
        'Emergency Contact Name': 'Jane Doe',
        'Emergency Contact Phone': '+254700654321',
        'Emergency Contact Relationship': 'Spouse',
        'Notes': 'Excellent mathematics teacher'
      }
    ]

    exportToCSV(template, 'teacher-import-template.csv')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setShowResults(false)
      setImportResults([])
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }
    }

    return data
  }

  const validateTeacherData = (row: any, rowNumber: number): ImportResult => {
    const errors: string[] = []
    
    // Required fields validation
    if (!row['Employee ID']) errors.push('Employee ID is required')
    if (!row['Full Name']) errors.push('Full Name is required')
    if (!row['Gender'] || !['male', 'female'].includes(row['Gender'])) {
      errors.push('Gender must be either "male" or "female"')
    }
    if (!row['Date of Birth']) errors.push('Date of Birth is required')
    if (!row['Hire Date']) errors.push('Hire Date is required')
    if (!row['Contract Type'] || !['permanent', 'contract', 'temporary', 'substitute'].includes(row['Contract Type'])) {
      errors.push('Contract Type must be one of: permanent, contract, temporary, substitute')
    }
    if (!row['Status'] || !['active', 'inactive', 'on-leave'].includes(row['Status'])) {
      errors.push('Status must be one of: active, inactive, on-leave')
    }

    // Date validation
    const dateOfBirth = new Date(row['Date of Birth'])
    const hireDate = new Date(row['Hire Date'])
    if (isNaN(dateOfBirth.getTime())) errors.push('Invalid Date of Birth format')
    if (isNaN(hireDate.getTime())) errors.push('Invalid Hire Date format')

    // Email validation
    if (row['Email'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row['Email'])) {
      errors.push('Invalid email format')
    }

    // Subject validation
    const subjectIds = row['Subjects'] ? row['Subjects'].split(',').map((s: string) => s.trim()) : []
    const validSubjectIds = subjects.map(s => s.id)
    const invalidSubjects = subjectIds.filter((id: string) => id && !validSubjectIds.includes(id))
    if (invalidSubjects.length > 0) {
      errors.push(`Invalid subject IDs: ${invalidSubjects.join(', ')}`)
    }

    // Class validation
    const classIds = row['Classes'] ? row['Classes'].split(',').map((c: string) => c.trim()) : []
    const validClassIds = classes.map(c => c.id)
    const invalidClasses = classIds.filter((id: string) => id && !validClassIds.includes(id))
    if (invalidClasses.length > 0) {
      errors.push(`Invalid class IDs: ${invalidClasses.join(', ')}`)
    }

    if (errors.length > 0) {
      return { success: false, row: rowNumber, errors }
    }

    // Create teacher data object
    const teacherData: CreateTeacherData = {
      employeeId: row['Employee ID'],
      name: row['Full Name'],
      email: row['Email'] || undefined,
      phone: row['Phone'] || undefined,
      gender: row['Gender'] as 'male' | 'female',
      dateOfBirth: new Date(row['Date of Birth']),
      address: row['Address'] || undefined,
      qualification: row['Qualification'] || undefined,
      experience: row['Experience'] || undefined,
      specialization: row['Specialization'] || undefined,
      hireDate: new Date(row['Hire Date']),
      contractType: row['Contract Type'] as 'permanent' | 'contract' | 'temporary' | 'substitute',
      status: row['Status'] as 'active' | 'inactive' | 'on-leave',
      salary: row['Salary'] ? Number(row['Salary']) : undefined,
      subjects: subjectIds.filter((id: string) => id),
      classes: classIds.filter((id: string) => id),
      tscNumber: row['TSC Number'] || undefined,
      idNumber: row['ID Number'] || undefined,
      emergencyContact: {
        name: row['Emergency Contact Name'] || undefined,
        phone: row['Emergency Contact Phone'] || undefined,
        relationship: row['Emergency Contact Relationship'] || undefined,
      },
      notes: row['Notes'] || undefined,
    }

    return { success: true, row: rowNumber, data: teacherData, errors: [] }
  }

  const handleImport = async () => {
    if (!file) return

    setIsProcessing(true)
    setShowResults(false)

    try {
      const csvText = await file.text()
      const csvData = parseCSV(csvText)
      const results: ImportResult[] = []

      // Validate all rows first
      for (let i = 0; i < csvData.length; i++) {
        const result = validateTeacherData(csvData[i], i + 2) // +2 because row 1 is header and we're 0-indexed
        results.push(result)
      }

      // Import valid records
      let successCount = 0
      for (const result of results) {
        if (result.success && result.data) {
          try {
            await createTeacher.mutateAsync(result.data)
            successCount++
          } catch (error) {
            result.success = false
            result.errors.push(`Failed to create teacher: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
      }

      setImportResults(results)
      setShowResults(true)
      
      if (successCount > 0) {
        onImportComplete(successCount)
      }
    } catch (error) {
      alert('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const successfulImports = importResults.filter(r => r.success).length
  const failedImports = importResults.filter(r => !r.success).length

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Import Teachers from CSV</h3>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with teacher data. Make sure it follows the required format.
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* File Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file" className="text-sm font-medium">
                Select CSV File
              </Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null)
                    setShowResults(false)
                    setImportResults([])
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={!file || isProcessing}
                className="min-w-[120px]"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Import Results
              <div className="ml-auto flex items-center space-x-2">
                {successfulImports > 0 && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {successfulImports} Success
                  </Badge>
                )}
                {failedImports > 0 && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {failedImports} Failed
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {successfulImports > 0 && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <div className="ml-2">
                  <h4 className="font-medium">Import Successful</h4>
                  <p className="text-sm text-muted-foreground">
                    Successfully imported {successfulImports} teacher{successfulImports !== 1 ? 's' : ''}.
                  </p>
                </div>
              </Alert>
            )}

            {failedImports > 0 && (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <div className="ml-2">
                    <h4 className="font-medium">Import Errors</h4>
                    <p className="text-sm">
                      {failedImports} record{failedImports !== 1 ? 's' : ''} failed to import. Please review the errors below:
                    </p>
                  </div>
                </Alert>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {importResults
                    .filter(result => !result.success)
                    .map((result, index) => (
                      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <div className="font-medium text-sm text-red-800 dark:text-red-200">
                          Row {result.row}:
                        </div>
                        <ul className="text-sm text-red-600 dark:text-red-300 mt-1 list-disc list-inside">
                          {result.errors.map((error, errorIndex) => (
                            <li key={errorIndex}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Import Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Required Fields:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Employee ID (must be unique)</li>
                <li>Full Name</li>
                <li>Gender (male/female)</li>
                <li>Date of Birth (YYYY-MM-DD format)</li>
                <li>Hire Date (YYYY-MM-DD format)</li>
                <li>Contract Type (permanent/contract/temporary/substitute)</li>
                <li>Status (active/inactive/on-leave)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Optional Fields:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email, Phone, Address</li>
                <li>Qualification, Experience, Specialization</li>
                <li>Salary (numeric value)</li>
                <li>Subjects (comma-separated subject IDs)</li>
                <li>Classes (comma-separated class IDs)</li>
                <li>TSC Number, ID Number</li>
                <li>Emergency Contact details</li>
                <li>Notes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Subject IDs:</h4>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <Badge key={subject.id} variant="outline" className="text-xs">
                    {subject.id} ({subject.name})
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Class IDs:</h4>
              <div className="flex flex-wrap gap-2">
                {classes.map(classItem => (
                  <Badge key={classItem.id} variant="outline" className="text-xs">
                    {classItem.id} ({classItem.name})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}