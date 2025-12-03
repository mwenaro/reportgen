'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  createExcelParser, 
  ExcelData, 
  ClassData, 
  ValidationResult,
  KENYAN_GRADING_SYSTEMS 
} from '@/lib/excel-report-parser'
import { 
  createReportGenerator, 
  downloadReport, 
  downloadAllReports, 
  ReportGenerationOptions,
  GeneratedReport 
} from '@/lib/excel-report-generator'
import { downloadSampleTemplate, downloadCBCTemplate } from '@/lib/excel-template-generator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import LoadingSpinner, { ButtonSpinner } from '@/components/ui/loading-spinner'
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  School,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ArrowLeft,
  Settings,
  Info,
  Trash2
} from 'lucide-react'

// Report generation state
interface ReportGenerationState {
  isGenerating: boolean
  progress: {
    completed: number
    total: number
    current: string
  }
  generatedReports: GeneratedReport[]
  completed: boolean
}



export default function ExcelImportPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [excelData, setExcelData] = useState<ExcelData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedGradingSystem, setSelectedGradingSystem] = useState<'8-4-4' | 'CBC'>('8-4-4')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [reportGeneration, setReportGeneration] = useState<ReportGenerationState>({
    isGenerating: false,
    progress: {
      completed: 0,
      total: 0,
      current: ''
    },
    generatedReports: [],
    completed: false
  })
  const [reportOptions, setReportOptions] = useState<ReportGenerationOptions>({
    includeStudentReports: true,
    includeClassAnalysis: true,
    includeSubjectAnalysis: true,
    gradingSystem: '8-4-4'
  })
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [selectedReportTypes, setSelectedReportTypes] = useState<string[]>(['all'])
  const [bundleStudentReports, setBundleStudentReports] = useState(true)

  const [parser, setParser] = useState(() => createExcelParser(selectedGradingSystem))

  // Update parser when grading system changes
  const updateParser = useCallback((gradingSystem: '8-4-4' | 'CBC') => {
    setParser(createExcelParser(gradingSystem))
    setReportOptions(prev => ({ ...prev, gradingSystem }))
  }, [])

  // Parse Excel file using the utility
  const parseExcelFile = useCallback(async (file: File): Promise<ExcelData> => {
    return parser.parseExcelFile(file)
  }, [parser])

  // Validate Excel data using the parser utility
  const validateExcelData = useCallback((data: ExcelData): ValidationResult => {
    return parser.validateExcelData(data)
  }, [parser])

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return
    
    setIsProcessing(true)
    setSelectedFile(file)
    
    try {
      const parsedData = await parseExcelFile(file)
      const validation = validateExcelData(parsedData)
      
      setExcelData(parsedData)
      setValidationResult(validation)
      
      // Update school education system based on parsed data
      if (parsedData.schoolDetails.educationSystem !== selectedGradingSystem) {
        setSelectedGradingSystem(parsedData.schoolDetails.educationSystem)
        updateParser(parsedData.schoolDetails.educationSystem)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      setValidationResult({
        isValid: false,
        errors: ['Failed to process the file. Please try again.'],
        warnings: []
      })
    } finally {
      setIsProcessing(false)
    }
  }, [parseExcelFile, validateExcelData, selectedGradingSystem])

  // Generate reports using the report generator
  const generateReports = useCallback(async () => {
    if (!excelData || !validationResult?.isValid) return

    setShowProgressDialog(true)
    setReportGeneration({
      isGenerating: true,
      progress: { completed: 0, total: 0, current: 'Initializing...' },
      generatedReports: [],
      completed: false
    })

    try {
      const reportGenerator = createReportGenerator(excelData, reportOptions)
      let reports: any[] = []
      let completed = 0
      let total = 0
      
      // Calculate total reports
      if (reportOptions.includeStudentReports && !bundleStudentReports) {
        total += excelData.classes.reduce((sum, cls) => sum + cls.totalStudents, 0)
      } else if (reportOptions.includeStudentReports && bundleStudentReports) {
        total += 1 // One bundled report
      }
      if (reportOptions.includeClassAnalysis) total += excelData.classes.length
      if (reportOptions.includeSubjectAnalysis) total += 1
      total += excelData.classes.length // Exam score sheets for each class
      total += 1 // Summary report
      
      const updateProgress = (current: string) => {
        setReportGeneration(prev => ({
          ...prev,
          progress: { completed, total, current }
        }))
      }

      // Generate student reports (bundled or individual)
      if (reportOptions.includeStudentReports) {
        if (bundleStudentReports) {
          updateProgress('Generating bundled student reports...')
          const bundledReport = reportGenerator.generateBundledStudentReports()
          reports.push(bundledReport)
          completed++
        } else {
          // Generate individual student reports
          for (const classData of excelData.classes) {
            if (classData.studentAnalysis) {
              for (const student of classData.studentAnalysis) {
                updateProgress(`Generating report for ${student.name}`)
                const report = reportGenerator.generateStudentReport(student, classData)
                reports.push(report)
                completed++
                await new Promise(resolve => setTimeout(resolve, 50))
              }
            }
          }
        }
      }

      // Generate class analysis reports
      if (reportOptions.includeClassAnalysis) {
        for (const classData of excelData.classes) {
          updateProgress(`Generating ${classData.grade} class analysis`)
          const report = reportGenerator.generateClassAnalysisReport(classData)
          reports.push(report)
          completed++
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }

      // Generate exam score sheets for all classes
      for (const classData of excelData.classes) {
        updateProgress(`Generating ${classData.grade} exam score sheet`)
        const scoreSheet = reportGenerator.generateClassExamScoreSheet(classData)
        reports.push(scoreSheet)
        completed++
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // Generate subject analysis report
      if (reportOptions.includeSubjectAnalysis) {
        updateProgress('Generating subject analysis report')
        const report = reportGenerator.generateSubjectAnalysisReport()
        reports.push(report)
        completed++
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // Generate summary report
      updateProgress('Generating summary report')
      const summaryReport = reportGenerator.generateSummaryReport()
      reports.push(summaryReport)
      completed++

      setReportGeneration({
        isGenerating: false,
        progress: {
          completed: reports.length,
          total: reports.length,
          current: 'All reports generated successfully!'
        },
        generatedReports: reports,
        completed: true
      })

    } catch (error) {
      console.error('Error generating reports:', error)
      setReportGeneration(prev => ({
        ...prev,
        isGenerating: false,
        progress: {
          ...prev.progress,
          current: 'Error generating reports. Please try again.'
        }
      }))
    }
  }, [excelData, validationResult, reportOptions])

  // Reset form
  const resetForm = useCallback(() => {
    setSelectedFile(null)
    setExcelData(null)
    setValidationResult(null)
    setSelectedClass(null)
    setShowPreviewDialog(false)
    setShowProgressDialog(false)
    setReportGeneration({
      isGenerating: false,
      progress: { completed: 0, total: 0, current: '' },
      generatedReports: [],
      completed: false
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Excel Report Generation</h1>
            <p className="text-muted-foreground">
              Import Excel data and generate comprehensive academic reports
            </p>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            Excel File Format Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <School className="h-4 w-4 mr-2" />
                Sheet 1: School Details
              </h3>
              <div className="text-sm space-y-1">
                <p>• <strong>Column A:</strong> Field names (Name, Education System, Box, Tel, Email, Motto)</p>
                <p>• <strong>Column B:</strong> Corresponding values</p>
                <p>• Education System should specify either "8-4-4" or "CBC"</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Subsequent Sheets: Class Data
              </h3>
              <div className="text-sm space-y-1">
                <p>• <strong>Sheet name:</strong> "Grade 3A - Math Test - Term 1"</p>
                <p>• <strong>Columns:</strong> No, Name, Gender, then subject names</p>
                <p>• <strong>Rows:</strong> Student data with marks for each subject</p>
                <p>• Subject names will be used as column headers</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-3">
              <strong>Example subjects:</strong> Mathematics (mat), English (eng), Kiswahili (kis), Science (sci), 
              Social Studies (sst), etc.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedGradingSystem === 'CBC' ? downloadCBCTemplate() : downloadSampleTemplate()}
              >
                <Download className="h-4 w-4 mr-2" />
                Download {selectedGradingSystem} Template
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (selectedGradingSystem === '8-4-4') {
                    downloadCBCTemplate()
                  } else {
                    downloadSampleTemplate()
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Get {selectedGradingSystem === '8-4-4' ? 'CBC' : '8-4-4'} Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Excel File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grading-system">Grading System</Label>
                <Select value={selectedGradingSystem} onValueChange={(value: '8-4-4' | 'CBC') => {
                  setSelectedGradingSystem(value)
                  updateParser(value)
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8-4-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        8-4-4 System (Secondary)
                      </div>
                    </SelectItem>
                    <SelectItem value="CBC">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        CBC System (Competency-Based)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedGradingSystem === '8-4-4' 
                    ? 'Traditional grading: A (80-100) to E (0-29)'
                    : 'Competency-based: EE (80-100) to BE (0-39)'
                  }
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excel-file">Excel File</Label>
              <div className="flex items-center space-x-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {selectedFile && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-sm">Processing Excel file...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
              )}
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Errors ({validationResult.errors.length})
                  </h4>
                  {validationResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-yellow-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Warnings ({validationResult.warnings.length})
                  </h4>
                  {validationResult.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      {warning}
                    </div>
                  ))}
                </div>
              )}

              {validationResult.isValid && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✅ Excel file is valid and ready for report generation
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {excelData && validationResult?.isValid && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* School Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <School className="h-4 w-4 mr-2" />
                  School Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {excelData.schoolDetails.name || 'Not specified'}</div>
                  <div><strong>Education System:</strong> 
                    <Badge variant="outline" className="ml-2">
                      {excelData.schoolDetails.educationSystem}
                    </Badge>
                  </div>
                  {excelData.schoolDetails.box && <div><strong>Box:</strong> {excelData.schoolDetails.box}</div>}
                  {excelData.schoolDetails.tel && <div><strong>Tel:</strong> {excelData.schoolDetails.tel}</div>}
                  {excelData.schoolDetails.email && <div><strong>Email:</strong> {excelData.schoolDetails.email}</div>}
                  {excelData.schoolDetails.motto && <div><strong>Motto:</strong> {excelData.schoolDetails.motto}</div>}
                </div>
              </div>

              <Separator />

              {/* Classes Overview */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Classes Overview ({excelData.classes.length})
                </h3>
                <div className="space-y-2">
                  {excelData.classes.map((classData, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{classData.grade}</Badge>
                          <span className="font-medium">{classData.examName}</span>
                          <span className="text-sm text-muted-foreground">({classData.term})</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {classData.totalStudents} students • {classData.subjects.length} subjects • 
                          Avg: {classData.averageScore}% • Pass Rate: {classData.passRate}%
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedClass(classData)
                          setShowPreviewDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Reports Section */}
      {excelData && validationResult?.isValid && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reports to Generate</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={reportOptions.includeStudentReports}
                        onChange={(e) => setReportOptions(prev => ({...prev, includeStudentReports: e.target.checked}))}
                        className="rounded"
                      />
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Individual student terminal reports ({excelData.classes.reduce((sum, cls) => sum + cls.totalStudents, 0)} students)</span>
                    </div>
                    <div className="flex items-center space-x-3 ml-6">
                      <input 
                        type="checkbox" 
                        checked={bundleStudentReports}
                        onChange={(e) => setBundleStudentReports(e.target.checked)}
                        className="rounded"
                        disabled={!reportOptions.includeStudentReports}
                      />
                      <span className="text-xs text-muted-foreground">Bundle all student reports in one PDF</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={reportOptions.includeClassAnalysis}
                        onChange={(e) => setReportOptions(prev => ({...prev, includeClassAnalysis: e.target.checked}))}
                        className="rounded"
                      />
                      <GraduationCap className="h-4 w-4 text-green-500" />
                      <span>Class performance analysis ({excelData.classes.length} classes)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={reportOptions.includeSubjectAnalysis}
                        onChange={(e) => setReportOptions(prev => ({...prev, includeSubjectAnalysis: e.target.checked}))}
                        className="rounded"
                      />
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span>Subject analysis and rankings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={true}
                        onChange={() => {}}
                        className="rounded"
                      />
                      <FileSpreadsheet className="h-4 w-4 text-orange-500" />
                      <span>Class exam score sheets ({excelData.classes.length} classes)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Grading System</Label>
                  <div className="text-sm p-3 bg-muted rounded">
                    <div className="font-medium mb-2">
                      {KENYAN_GRADING_SYSTEMS[selectedGradingSystem].name}
                    </div>
                    <div className="space-y-1">
                      {KENYAN_GRADING_SYSTEMS[selectedGradingSystem].grades.slice(0, 4).map(grade => (
                        <div key={grade.grade} className="flex justify-between">
                          <span>{grade.grade}: {grade.description}</span>
                          <span>{grade.min}-{grade.max}%</span>
                        </div>
                      ))}
                      {KENYAN_GRADING_SYSTEMS[selectedGradingSystem].grades.length > 4 && (
                        <div className="text-xs text-muted-foreground">
                          ...and {KENYAN_GRADING_SYSTEMS[selectedGradingSystem].grades.length - 4} more grades
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateReports}
                className="w-full"
                size="lg"
                disabled={reportGeneration.isGenerating || !Object.values(reportOptions).some(Boolean)}
              >
                {reportGeneration.isGenerating ? (
                  <ButtonSpinner size="sm" className="mr-2" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                {reportGeneration.isGenerating ? 'Generating Reports...' : 'Generate All Reports'}
              </Button>
              {!Object.values(reportOptions).some(Boolean) && (
                <p className="text-sm text-red-500 text-center mt-2">
                  Please select at least one report type to generate
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedClass?.grade} - {selectedClass?.examName} ({selectedClass?.term})
            </DialogTitle>
            <DialogDescription>
              Preview of student data and marks
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Students:</strong> {selectedClass.totalStudents}
                </div>
                <div>
                  <strong>Subjects:</strong> {selectedClass.subjects.length}
                </div>
                <div>
                  <strong>Average:</strong> {selectedClass.averageScore}%
                </div>
                <div>
                  <strong>Pass Rate:</strong> {selectedClass.passRate}%
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      {selectedClass.subjects.map(subject => (
                        <TableHead key={subject} className="text-center">{subject}</TableHead>
                      ))}
                      <TableHead className="text-center">Average</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClass.students.slice(0, 10).map((student, index) => {
                      const scores = selectedClass.subjects.map(subject => student[subject.toLowerCase()] as number || 0);
                      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                      const grade = parser.calculateGrade(average);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{student.no}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          {selectedClass.subjects.map(subject => (
                            <TableCell key={subject} className="text-center">
                              {student[subject.toLowerCase()] as number || '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-medium">
                            {average.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{grade.grade}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              {selectedClass.students.length > 10 && (
                <div className="text-center text-sm text-muted-foreground">
                  Showing first 10 students. {selectedClass.students.length - 10} more students will be included in the report.
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Generation Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generating Reports</DialogTitle>
            <DialogDescription>
              Please wait while we generate all reports...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{reportGeneration.progress.completed} / {reportGeneration.progress.total}</span>
              </div>
              <Progress 
                value={reportGeneration.progress.total > 0 ? (reportGeneration.progress.completed / reportGeneration.progress.total) * 100 : 0} 
              />
            </div>
            
            {reportGeneration.isGenerating && (
              <div className="text-sm text-muted-foreground">
                <div><strong>Current:</strong> {reportGeneration.progress.current}</div>
              </div>
            )}
            
            {reportGeneration.completed && (
              <div className="space-y-4">
                <div className="text-center text-green-600">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-medium">All reports generated successfully!</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {reportGeneration.generatedReports.length} reports ready for download
                  </div>
                </div>
                
                {/* Categorized Report Downloads */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'student-bundle')
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">All Student Reports (Bundled)</div>
                            <div className="text-xs text-muted-foreground">{report.className}</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'student')
                    .slice(0, 5)
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">Student Report</div>
                            <div className="text-xs text-muted-foreground">{report.studentName} - {report.className}</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  
                  {reportGeneration.generatedReports.filter(r => r.type === 'student').length > 5 && (
                    <div className="text-center text-xs text-muted-foreground">
                      ...and {reportGeneration.generatedReports.filter(r => r.type === 'student').length - 5} more student reports
                    </div>
                  )}
                  
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'class-scoresheet')
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="h-4 w-4 text-orange-500" />
                          <div>
                            <div className="text-sm font-medium">Exam Score Sheet</div>
                            <div className="text-xs text-muted-foreground">{report.className}</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'class-analysis')
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm font-medium">Class Analysis</div>
                            <div className="text-xs text-muted-foreground">{report.className}</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'subject-analysis')
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-purple-500" />
                          <div>
                            <div className="text-sm font-medium">Subject Analysis Report</div>
                            <div className="text-xs text-muted-foreground">All subjects performance</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  
                  {reportGeneration.generatedReports
                    .filter(r => r.type === 'summary')
                    .map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <School className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">Summary Report</div>
                            <div className="text-xs text-muted-foreground">Overall school performance</div>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => downloadReport(report)}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          {reportGeneration.completed && (
            <DialogFooter>
              <Button onClick={() => setShowProgressDialog(false)}>
                Close
              </Button>
              <Button 
                variant="outline" 
                onClick={() => downloadAllReports(reportGeneration.generatedReports)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}