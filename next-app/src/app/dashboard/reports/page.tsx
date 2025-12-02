'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStudentReportGenerator, generateSampleStudentData, generateVariedSampleData } from '@/lib/hooks/useStudentReportGenerator'
import { StudentData } from '@/lib/report-generator/StudentReportGenerator'
import LoadingSpinner, { ButtonSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Filter,
  FileText,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  School,
  BookOpen,
  Award,
  Target,
  PieChart,
  LineChart
} from 'lucide-react'

interface AssessmentReport {
  id: string
  title: string
  type: 'student_terminal' | 'class_terminal' | 'subject_scoresheet' | 'class_scoresheet' | 'performance_analysis' | 'progress_report'
  description: string
  term: 'Term 1' | 'Term 2' | 'Term 3' | 'Annual'
  academicYear: string
  class?: string
  subject?: string
  student?: string
  teacher: string
  reportScope?: 'single' | 'class'
  totalStudents?: number
  avgScore?: number
  highestScore?: number
  lowestScore?: number
  passRate?: number
  generatedDate: string
  status: 'draft' | 'generated' | 'published' | 'archived'
  format: 'pdf' | 'excel' | 'word' | 'csv'
  fileSize?: string
  downloadCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

// Mock data for assessment reports
const mockReports: AssessmentReport[] = [
  {
    id: '1',
    title: 'Grade 1A Terminal Report - Mathematics',
    type: 'class_terminal',
    description: 'Comprehensive class performance report for Mathematics Term 1',
    term: 'Term 1',
    academicYear: '2024-2025',
    class: 'Grade 1A',
    subject: 'Mathematics',
    teacher: 'Sarah Johnson',
    totalStudents: 25,
    avgScore: 78.5,
    highestScore: 95,
    lowestScore: 45,
    passRate: 88,
    generatedDate: '2024-04-15',
    status: 'published',
    format: 'pdf',
    fileSize: '2.4 MB',
    downloadCount: 12,
    createdBy: 'Sarah Johnson',
    createdAt: '2024-04-15T10:00:00Z',
    updatedAt: '2024-04-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'John Smith - Individual Terminal Report',
    type: 'student_terminal',
    description: 'Complete academic performance report for John Smith',
    term: 'Term 1',
    academicYear: '2024-2025',
    class: 'Grade 2B',
    student: 'John Smith',
    teacher: 'Emily Davis',
    avgScore: 82.3,
    generatedDate: '2024-04-16',
    status: 'generated',
    format: 'pdf',
    fileSize: '1.8 MB',
    downloadCount: 3,
    createdBy: 'Emily Davis',
    createdAt: '2024-04-16T09:00:00Z',
    updatedAt: '2024-04-16T09:00:00Z'
  },
  {
    id: '3',
    title: 'English Language Scoresheet - All Classes',
    type: 'subject_scoresheet',
    description: 'Subject-wide performance analysis for English Language',
    term: 'Term 1',
    academicYear: '2024-2025',
    subject: 'English Language',
    teacher: 'Michael Chen',
    totalStudents: 75,
    avgScore: 74.2,
    highestScore: 92,
    lowestScore: 38,
    passRate: 82,
    generatedDate: '2024-04-18',
    status: 'published',
    format: 'excel',
    fileSize: '856 KB',
    downloadCount: 8,
    createdBy: 'Michael Chen',
    createdAt: '2024-04-18T11:00:00Z',
    updatedAt: '2024-04-18T11:00:00Z'
  },
  {
    id: '4',
    title: 'Form 3A Class Scoresheet - All Subjects',
    type: 'class_scoresheet',
    description: 'Complete class performance across all subjects',
    term: 'Term 2',
    academicYear: '2024-2025',
    class: 'Form 3A',
    teacher: 'Dr. Robert Wilson',
    totalStudents: 28,
    avgScore: 71.8,
    highestScore: 89,
    lowestScore: 42,
    passRate: 78,
    generatedDate: '2024-08-20',
    status: 'generated',
    format: 'pdf',
    fileSize: '3.2 MB',
    downloadCount: 15,
    createdBy: 'Dr. Robert Wilson',
    createdAt: '2024-08-20T14:00:00Z',
    updatedAt: '2024-08-20T14:00:00Z'
  },
  {
    id: '5',
    title: 'Physics Performance Analysis - Term 2',
    type: 'performance_analysis',
    description: 'Detailed performance trends and analytics for Physics',
    term: 'Term 2',
    academicYear: '2024-2025',
    subject: 'Physics',
    teacher: 'Dr. Lisa Anderson',
    totalStudents: 45,
    avgScore: 68.7,
    highestScore: 94,
    lowestScore: 35,
    passRate: 73,
    generatedDate: '2024-08-25',
    status: 'draft',
    format: 'excel',
    fileSize: '1.2 MB',
    downloadCount: 0,
    createdBy: 'Dr. Lisa Anderson',
    createdAt: '2024-08-25T16:00:00Z',
    updatedAt: '2024-08-25T16:00:00Z'
  },
  {
    id: '6',
    title: 'Maria Rodriguez - Progress Report',
    type: 'progress_report',
    description: 'Monthly progress tracking report for Maria Rodriguez',
    term: 'Term 2',
    academicYear: '2024-2025',
    class: 'Grade 4B',
    student: 'Maria Rodriguez',
    teacher: 'John Smith',
    avgScore: 85.6,
    generatedDate: '2024-09-01',
    status: 'published',
    format: 'pdf',
    fileSize: '1.5 MB',
    downloadCount: 5,
    createdBy: 'John Smith',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z'
  }
]

export default function ReportsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Mock system data - configured for Kenyan education systems (8-4-4 and CBE/CBC)
  const systemData = {
    academicYears: ['2025', '2024', '2023', '2022'],
    educationSystems: ['8-4-4 System', 'CBE/CBC System'],
    teachers: [
      { id: '1', name: 'Sarah Wanjiku', subjects: ['Mathematics', 'Statistics'], system: '8-4-4' },
      { id: '2', name: 'Michael Ochieng', subjects: ['English Language', 'Literature'], system: '8-4-4' },
      { id: '3', name: 'Grace Muthoni', subjects: ['Biology', 'Chemistry'], system: '8-4-4' },
      { id: '4', name: 'Dr. Robert Kiprotich', subjects: ['Physics', 'Mathematics'], system: '8-4-4' },
      { id: '5', name: 'Dr. Mary Njeri', subjects: ['Physics', 'Chemistry'], system: '8-4-4' },
      { id: '6', name: 'John Kamau', subjects: ['History & Government', 'Geography'], system: '8-4-4' },
      { id: '7', name: 'Esther Waweru', subjects: ['Kiswahili', 'CRE'], system: '8-4-4' },
      { id: '8', name: 'David Mutua', subjects: ['Business Studies', 'Economics'], system: '8-4-4' },
      { id: '9', name: 'Lucy Akinyi', subjects: ['Integrated Science', 'Mathematics'], system: 'CBC' },
      { id: '10', name: 'Peter Mwangi', subjects: ['Social Studies', 'English'], system: 'CBC' },
      { id: '11', name: 'Faith Chebet', subjects: ['Kiswahili', 'Life Skills'], system: 'CBC' }
    ],
    classes: [
      // CBC System Classes
      { id: '1', name: 'PP1 Red', level: 'Pre-Primary 1', students: 25, system: 'CBC' },
      { id: '2', name: 'PP2 Blue', level: 'Pre-Primary 2', students: 28, system: 'CBC' },
      { id: '3', name: 'Grade 1A', level: 'Grade 1', students: 30, system: 'CBC' },
      { id: '4', name: 'Grade 2A', level: 'Grade 2', students: 32, system: 'CBC' },
      { id: '5', name: 'Grade 3A', level: 'Grade 3', students: 35, system: 'CBC' },
      { id: '6', name: 'Grade 4A', level: 'Grade 4', students: 38, system: 'CBC' },
      { id: '7', name: 'Grade 5A', level: 'Grade 5', students: 40, system: 'CBC' },
      { id: '8', name: 'Grade 6A', level: 'Grade 6', students: 42, system: 'CBC' },
      { id: '9', name: 'Grade 7A', level: 'Grade 7', students: 45, system: 'CBC' },
      { id: '10', name: 'Grade 8A', level: 'Grade 8', students: 43, system: 'CBC' },
      { id: '11', name: 'Grade 9A', level: 'Grade 9', students: 41, system: 'CBC' },
      
      // 8-4-4 System Classes (Traditional Secondary)
      { id: '12', name: 'Form 1A', level: 'Form 1', students: 42, system: '8-4-4' },
      { id: '13', name: 'Form 1B', level: 'Form 1', students: 40, system: '8-4-4' },
      { id: '14', name: 'Form 1C', level: 'Form 1', students: 38, system: '8-4-4' },
      { id: '15', name: 'Form 2A', level: 'Form 2', students: 44, system: '8-4-4' },
      { id: '16', name: 'Form 2B', level: 'Form 2', students: 42, system: '8-4-4' },
      { id: '17', name: 'Form 2C', level: 'Form 2', students: 41, system: '8-4-4' },
      { id: '18', name: 'Form 3A', level: 'Form 3', students: 38, system: '8-4-4' },
      { id: '19', name: 'Form 3B', level: 'Form 3', students: 36, system: '8-4-4' },
      { id: '20', name: 'Form 4A', level: 'Form 4', students: 35, system: '8-4-4' },
      { id: '21', name: 'Form 4B', level: 'Form 4', students: 33, system: '8-4-4' }
    ],
    subjects: [
      // 8-4-4 System Subjects (Secondary)
      { id: '1', name: 'Mathematics', code: 'MAT', department: 'Sciences', system: '8-4-4', level: 'Secondary' },
      { id: '2', name: 'English Language', code: 'ENG', department: 'Languages', system: '8-4-4', level: 'Secondary' },
      { id: '3', name: 'Kiswahili', code: 'KIS', department: 'Languages', system: '8-4-4', level: 'Secondary' },
      { id: '4', name: 'Biology', code: 'BIO', department: 'Sciences', system: '8-4-4', level: 'Secondary' },
      { id: '5', name: 'Chemistry', code: 'CHE', department: 'Sciences', system: '8-4-4', level: 'Secondary' },
      { id: '6', name: 'Physics', code: 'PHY', department: 'Sciences', system: '8-4-4', level: 'Secondary' },
      { id: '7', name: 'History & Government', code: 'HIS', department: 'Humanities', system: '8-4-4', level: 'Secondary' },
      { id: '8', name: 'Geography', code: 'GEO', department: 'Humanities', system: '8-4-4', level: 'Secondary' },
      { id: '9', name: 'Christian Religious Education', code: 'CRE', department: 'Humanities', system: '8-4-4', level: 'Secondary' },
      { id: '10', name: 'Business Studies', code: 'BST', department: 'Technical', system: '8-4-4', level: 'Secondary' },
      { id: '11', name: 'Economics', code: 'ECO', department: 'Humanities', system: '8-4-4', level: 'Secondary' },
      { id: '12', name: 'Literature in English', code: 'LIT', department: 'Languages', system: '8-4-4', level: 'Secondary' },
      { id: '13', name: 'Computer Studies', code: 'COM', department: 'Technical', system: '8-4-4', level: 'Secondary' },
      { id: '14', name: 'Agriculture', code: 'AGR', department: 'Technical', system: '8-4-4', level: 'Secondary' },
      { id: '15', name: 'Home Science', code: 'HSC', department: 'Technical', system: '8-4-4', level: 'Secondary' },
      
      // CBC System Subjects (Primary & Junior Secondary)
      { id: '16', name: 'Mathematics', code: 'MAT', department: 'STEM', system: 'CBC', level: 'Primary' },
      { id: '17', name: 'English Activities', code: 'ENG', department: 'Languages', system: 'CBC', level: 'Primary' },
      { id: '18', name: 'Kiswahili Activities', code: 'KIS', department: 'Languages', system: 'CBC', level: 'Primary' },
      { id: '19', name: 'Environmental Activities', code: 'ENV', department: 'STEM', system: 'CBC', level: 'Primary' },
      { id: '20', name: 'Hygiene and Nutrition Activities', code: 'HYG', department: 'Life Skills', system: 'CBC', level: 'Primary' },
      { id: '21', name: 'Religious Education Activities', code: 'REL', department: 'Values', system: 'CBC', level: 'Primary' },
      { id: '22', name: 'Creative Arts', code: 'ART', department: 'Creative Arts', system: 'CBC', level: 'Primary' },
      { id: '23', name: 'Physical and Health Education', code: 'PHE', department: 'Life Skills', system: 'CBC', level: 'Primary' },
      { id: '24', name: 'Integrated Science', code: 'SCI', department: 'STEM', system: 'CBC', level: 'Junior Secondary' },
      { id: '25', name: 'Social Studies', code: 'SST', department: 'Humanities', system: 'CBC', level: 'Junior Secondary' },
      { id: '26', name: 'Life Skills Education', code: 'LSE', department: 'Life Skills', system: 'CBC', level: 'Junior Secondary' },
      { id: '27', name: 'Pre-Technical and Pre-Career Education', code: 'PTE', department: 'Technical', system: 'CBC', level: 'Junior Secondary' }
    ],
    examTypes: [
      // 8-4-4 System Assessments
      { id: '1', name: 'Mid-Term Exam', weight: 30, system: '8-4-4' },
      { id: '2', name: 'End-Term Exam', weight: 70, system: '8-4-4' },
      { id: '3', name: 'CAT 1', weight: 15, system: '8-4-4' },
      { id: '4', name: 'CAT 2', weight: 15, system: '8-4-4' },
      { id: '5', name: 'Assignment', weight: 10, system: '8-4-4' },
      { id: '6', name: 'KCSE Mock Exam', weight: 100, system: '8-4-4' },
      { id: '7', name: 'KCSE Trial Exam', weight: 100, system: '8-4-4' },
      { id: '8', name: 'KCSE Exam', weight: 100, system: '8-4-4' },
      
      // CBC System Assessments (Competency-Based)
      { id: '9', name: 'Formative Assessment', weight: 40, system: 'CBC' },
      { id: '10', name: 'Summative Assessment', weight: 60, system: 'CBC' },
      { id: '11', name: 'Project Work', weight: 20, system: 'CBC' },
      { id: '12', name: 'Portfolio Assessment', weight: 25, system: 'CBC' },
      { id: '13', name: 'Competency Assessment', weight: 30, system: 'CBC' },
      { id: '14', name: 'KPSEA (Grade 6)', weight: 100, system: 'CBC' },
      { id: '15', name: 'KPSE Assessment (Grade 9)', weight: 100, system: 'CBC' }
    ],
    terms: ['Term 1', 'Term 2', 'Term 3', 'Annual Assessment'],
    students: [
      // CBC System Students
      { id: '1', name: 'Amani Wanjiku', admissionNo: 'CBC/PP1/001', class: 'PP1 Red', level: 'Pre-Primary 1', system: 'CBC' },
      { id: '2', name: 'Brian Omondi', admissionNo: 'CBC/PP2/002', class: 'PP2 Blue', level: 'Pre-Primary 2', system: 'CBC' },
      { id: '3', name: 'Cynthia Muthoni', admissionNo: 'CBC/G1/003', class: 'Grade 1A', level: 'Grade 1', system: 'CBC' },
      { id: '4', name: 'Dennis Kiprotich', admissionNo: 'CBC/G2/004', class: 'Grade 2A', level: 'Grade 2', system: 'CBC' },
      { id: '5', name: 'Esther Akinyi', admissionNo: 'CBC/G3/005', class: 'Grade 3A', level: 'Grade 3', system: 'CBC' },
      { id: '6', name: 'Felix Mwangi', admissionNo: 'CBC/G4/006', class: 'Grade 4A', level: 'Grade 4', system: 'CBC' },
      { id: '7', name: 'Grace Chebet', admissionNo: 'CBC/G5/007', class: 'Grade 5A', level: 'Grade 5', system: 'CBC' },
      { id: '8', name: 'Hassan Abdullahi', admissionNo: 'CBC/G6/008', class: 'Grade 6A', level: 'Grade 6', system: 'CBC' },
      { id: '9', name: 'Irene Njeri', admissionNo: 'CBC/G7/009', class: 'Grade 7A', level: 'Grade 7', system: 'CBC' },
      { id: '10', name: 'Joseph Mutua', admissionNo: 'CBC/G8/010', class: 'Grade 8A', level: 'Grade 8', system: 'CBC' },
      { id: '11', name: 'Karen Waweru', admissionNo: 'CBC/G9/011', class: 'Grade 9A', level: 'Grade 9', system: 'CBC' },
      
      // 8-4-4 System Students (Secondary)
      { id: '12', name: 'Lewis Kimani', admissionNo: '2024/F1/001', class: 'Form 1A', level: 'Form 1', system: '8-4-4' },
      { id: '13', name: 'Mary Nyambura', admissionNo: '2024/F1/002', class: 'Form 1B', level: 'Form 1', system: '8-4-4' },
      { id: '14', name: 'Noah Ochieng', admissionNo: '2024/F1/003', class: 'Form 1C', level: 'Form 1', system: '8-4-4' },
      { id: '15', name: 'Olive Wanjiru', admissionNo: '2023/F2/001', class: 'Form 2A', level: 'Form 2', system: '8-4-4' },
      { id: '16', name: 'Peter Kariuki', admissionNo: '2023/F2/002', class: 'Form 2B', level: 'Form 2', system: '8-4-4' },
      { id: '17', name: 'Queenie Auma', admissionNo: '2023/F2/003', class: 'Form 2C', level: 'Form 2', system: '8-4-4' },
      { id: '18', name: 'Robert Mwende', admissionNo: '2022/F3/001', class: 'Form 3A', level: 'Form 3', system: '8-4-4' },
      { id: '19', name: 'Sarah Chepchumba', admissionNo: '2022/F3/002', class: 'Form 3B', level: 'Form 3', system: '8-4-4' },
      { id: '20', name: 'Timothy Kamau', admissionNo: '2021/F4/001', class: 'Form 4A', level: 'Form 4', system: '8-4-4' },
      { id: '21', name: 'Vivian Anyango', admissionNo: '2021/F4/002', class: 'Form 4B', level: 'Form 4', system: '8-4-4' }
    ],
    
    // Kenyan grading systems
    gradingSystems: {
      '8-4-4': {
        grades: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'],
        points: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        classification: {
          'A': 'Excellent',
          'A-': 'Very Good', 
          'B+': 'Good',
          'B': 'Good',
          'B-': 'Above Average',
          'C+': 'Average',
          'C': 'Average',
          'C-': 'Below Average',
          'D+': 'Weak',
          'D': 'Weak',
          'D-': 'Very Weak',
          'E': 'Failure'
        }
      },
      'CBC': {
        levels: ['Exceeding Expectations', 'Meeting Expectations', 'Approaching Expectations', 'Below Expectations'],
        ratings: ['EE', 'ME', 'AE', 'BE'],
        descriptions: {
          'EE': 'The learner demonstrates learning beyond expectations',
          'ME': 'The learner demonstrates expected learning',
          'AE': 'The learner demonstrates some expected learning',
          'BE': 'The learner demonstrates minimal expected learning'
        }
      }
    }
  }
  
  // Get URL parameters
  const searchTerm = searchParams.get('search') || ''
  const typeFilter = searchParams.get('type') || 'all'
  const statusFilter = searchParams.get('status') || 'all'
  const termFilter = searchParams.get('term') || 'all'
  const formatFilter = searchParams.get('format') || 'all'
  const sortBy = searchParams.get('sortBy') || 'generatedDate'
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  
  const [reports, setReports] = useState<AssessmentReport[]>(mockReports)
  const [filteredReports, setFilteredReports] = useState<AssessmentReport[]>(mockReports)
  const [paginatedReports, setPaginatedReports] = useState<AssessmentReport[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [viewingReport, setViewingReport] = useState<AssessmentReport | null>(null)
  const [formData, setFormData] = useState<Partial<AssessmentReport>>({
    type: 'class_terminal',
    term: 'Term 1',
    academicYear: '2024-2025',
    status: 'draft',
    format: 'pdf',
    downloadCount: 0,
    reportScope: 'single'
  })

  // PDF Report Generator
  const {
    generateStudentReport,
    generateBulkReports,
    previewReport,
    isGenerating,
    generatedReports
  } = useStudentReportGenerator({
    onSuccess: (filename) => {
      console.log('Report generated successfully:', filename)
      // You could show a success toast here
    },
    onError: (error) => {
      console.error('Error generating report:', error)
      alert('Error generating report: ' + error.message)
    }
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  
  // Form state for dropdowns
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedTerm, setSelectedTerm] = useState('')
  const [selectedExamType, setSelectedExamType] = useState('')
  
  // Filtered data based on selections
  const filteredStudents = selectedClass 
    ? systemData.students.filter(student => {
        const classData = systemData.classes.find(c => c.id === selectedClass)
        return student.class === classData?.name
      })
    : systemData.students
    
  const filteredSubjects = selectedTeacher 
    ? systemData.subjects.filter(subject => {
        const teacher = systemData.teachers.find(t => t.id === selectedTeacher)
        return teacher?.subjects.includes(subject.name) && teacher.system === subject.system
      })
    : systemData.subjects
    
  // Group classes by education system for better organization
  const classesBySystem = systemData.classes.reduce((acc, classData) => {
    if (!acc[classData.system]) acc[classData.system] = []
    acc[classData.system].push(classData)
    return acc
  }, {} as Record<string, typeof systemData.classes>)
    
  // Reset form fields
  const resetFormState = () => {
    setSelectedAcademicYear('')
    setSelectedTeacher('')
    setSelectedClass('')
    setSelectedSubject('')
    setSelectedStudent('')
    setSelectedTerm('')
    setSelectedExamType('')
    setFormData({
      type: 'student_terminal',
      reportScope: 'individual',
      term: '',
      academicYear: '',
      teacher: '',
      status: 'draft'
    })
  }

  // Update URL parameters
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.replace(`/dashboard/reports${query}`, { scroll: false })
  }

  // Filter and sort reports based on URL parameters
  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.student?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    if (termFilter !== 'all') {
      filtered = filtered.filter(report => report.term === termFilter)
    }

    if (formatFilter !== 'all') {
      filtered = filtered.filter(report => report.format === formatFilter)
    }

    // Sort reports
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'generatedDate':
          aValue = new Date(a.generatedDate).getTime()
          bValue = new Date(b.generatedDate).getTime()
          break
        case 'avgScore':
          aValue = a.avgScore || 0
          bValue = b.avgScore || 0
          break
        case 'downloadCount':
          aValue = a.downloadCount
          bValue = b.downloadCount
          break
        case 'teacher':
          aValue = a.teacher.toLowerCase()
          bValue = b.teacher.toLowerCase()
          break
        default:
          aValue = new Date(a.generatedDate).getTime()
          bValue = new Date(b.generatedDate).getTime()
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    setFilteredReports(filtered)
    
    // Calculate pagination
    const total = filtered.length
    const totalPagesCalc = Math.ceil(total / pageSize)
    setTotalPages(totalPagesCalc)
    
    // Get paginated results
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)
    setPaginatedReports(paginated)
    
  }, [reports, searchTerm, typeFilter, statusFilter, termFilter, formatFilter, sortBy, sortOrder, page, pageSize])

  const handleGenerateReport = async () => {
    if (!formData.title || !formData.type || !formData.teacher) {
      alert('Please fill in all required fields')
      return
    }

    // Validate student terminal report specific fields
    if (formData.type === 'student_terminal') {
      if (formData.reportScope === 'single' && !formData.student) {
        alert('Please enter the student name for individual report')
        return
      }
      if (formData.reportScope === 'class' && !formData.class) {
        alert('Please enter the class for whole class report')
        return
      }
      await handleGenerateStudentReport()
      return
    }

    // For other report types, create placeholder entry
    const newReport: AssessmentReport = {
      id: Date.now().toString(),
      title: formData.title!,
      type: formData.type as any,
      description: formData.description || '',
      term: formData.term as any,
      academicYear: formData.academicYear!,
      class: formData.class,
      subject: formData.subject,
      student: formData.student,
      teacher: formData.teacher!,
      totalStudents: formData.totalStudents,
      avgScore: formData.avgScore,
      highestScore: formData.highestScore,
      lowestScore: formData.lowestScore,
      passRate: formData.passRate,
      generatedDate: new Date().toISOString().split('T')[0],
      status: formData.status as any,
      format: formData.format as any,
      downloadCount: 0,
      createdBy: formData.teacher!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setReports([...reports, newReport])
    setIsGenerateDialogOpen(false)
    resetForm()
  }

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId))
  }

  const handleGenerateStudentReport = async () => {
    try {
      if (formData.reportScope === 'class') {
        // Generate reports for whole class
        const classStudents = generateVariedSampleData().map(student => ({
          ...student,
          form: formData.class?.charAt(formData.class.length - 2) || '3',
          class: formData.class || '3A',
          term: formData.term?.replace('Term ', '') || '1',
          year: formData.academicYear || '2024-2025'
        }))

        const results = await generateBulkReports(classStudents)
        const successCount = results.filter(r => r.success).length
        
        if (successCount > 0) {
          // Add bulk report entry to reports list
          const newReport: AssessmentReport = {
            id: Date.now().toString(),
            title: `${formData.class} - Class Terminal Reports (${successCount} students)`,
            type: 'student_terminal',
            description: `Individual terminal reports generated for all students in ${formData.class}`,
            term: formData.term as any,
            academicYear: formData.academicYear!,
            class: formData.class!,
            teacher: formData.teacher!,
            reportScope: 'class',
            totalStudents: classStudents.length,
            avgScore: classStudents.reduce((sum, s) => sum + (s.meanPoints * 8.33), 0) / classStudents.length,
            generatedDate: new Date().toISOString().split('T')[0],
            status: 'generated',
            format: 'pdf',
            fileSize: `${(successCount * 1.8).toFixed(1)} MB`,
            downloadCount: successCount,
            createdBy: formData.teacher!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          setReports([newReport, ...reports])
          alert(`Successfully generated ${successCount} student reports for ${formData.class}`)
        }
      } else {
        // Generate single student report
        const studentData = generateSampleStudentData({
          name: formData.student || 'John Doe',
          form: formData.class?.charAt(formData.class.length - 2) || '1',
          class: formData.class || '1A',
          term: formData.term?.replace('Term ', '') || '1',
          year: formData.academicYear || '2024-2025'
        })

        const result = await generateStudentReport(studentData)
        
        if (result.success) {
          // Add to reports list
          const newReport: AssessmentReport = {
            id: Date.now().toString(),
            title: `${studentData.name} - Individual Terminal Report`,
            type: 'student_terminal',
            description: `Complete academic performance report for ${studentData.name}`,
            term: formData.term as any,
            academicYear: formData.academicYear!,
            class: studentData.class,
            student: studentData.name,
            teacher: formData.teacher!,
            reportScope: 'single',
            avgScore: studentData.meanPoints * 8.33,
            generatedDate: new Date().toISOString().split('T')[0],
            status: 'generated',
            format: 'pdf',
            fileSize: '1.8 MB',
            downloadCount: 1,
            createdBy: formData.teacher!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          setReports([newReport, ...reports])
        }
      }
      
      setIsGenerateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error generating student report:', error)
      alert('Failed to generate report. Please try again.')
    }
  }

  const handlePreviewReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report && report.type === 'student_terminal') {
      try {
        // Generate sample data for preview
        const studentData = generateSampleStudentData({
          name: report.student || 'Sample Student',
          form: report.class?.charAt(report.class.length - 2) || '1',
          class: report.class || '1A',
          term: report.term.replace('Term ', '') || '1',
          year: report.academicYear
        })

        const url = await previewReport(studentData)
        if (url) {
          setPreviewUrl(url)
          setIsPreviewDialogOpen(true)
        }
      } catch (error) {
        console.error('Error generating preview:', error)
        alert('Failed to generate preview. Please try again.')
      }
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report && report.type === 'student_terminal') {
      try {
        // Generate sample data for download
        const studentData = generateSampleStudentData({
          name: report.student || 'Sample Student',
          form: report.class?.charAt(report.class.length - 2) || '1',
          class: report.class || '1A',
          term: report.term.replace('Term ', '') || '1',
          year: report.academicYear
        })

        await generateStudentReport(studentData)
        
        // Update download count
        setReports(reports.map(r => 
          r.id === reportId 
            ? { ...r, downloadCount: r.downloadCount + 1 }
            : r
        ))
      } catch (error) {
        console.error('Error downloading report:', error)
        alert('Failed to download report. Please try again.')
      }
    } else {
      // For non-student reports, show placeholder message
      alert('Download functionality for this report type is not yet implemented.')
    }
  }

  const handleDownloadSampleReport = async () => {
    try {
      // Generate sample student data with realistic information
      const sampleStudentData = generateSampleStudentData({
        name: 'Jane Doe',
        admissionNumber: '2024/001',
        form: '3',
        class: '3A',
        term: '1',
        year: '2024-2025',
        gender: 'F',
        kcpe: 382,
        position: 5,
        outOf: 45
      })

      await generateStudentReport(sampleStudentData, 'Sample_Student_Terminal_Report_Demo.pdf')
      
      // Add sample report to the list for demonstration
      const sampleReport: AssessmentReport = {
        id: 'sample-' + Date.now().toString(),
        title: `${sampleStudentData.name} - Sample Terminal Report`,
        type: 'student_terminal',
        description: 'Demonstration student terminal report with sample data',
        term: 'Term 1' as any,
        academicYear: '2024-2025',
        class: sampleStudentData.class,
        student: sampleStudentData.name,
        teacher: 'Demo Teacher',
        avgScore: sampleStudentData.meanPoints * 8.33,
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'published',
        format: 'pdf',
        fileSize: '1.9 MB',
        downloadCount: 1,
        createdBy: 'System Demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setReports([sampleReport, ...reports])
    } catch (error) {
      console.error('Error generating sample report:', error)
      alert('Failed to generate sample report. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'class_terminal',
      term: 'Term 1',
      academicYear: '2024-2025',
      status: 'draft',
      format: 'pdf',
      downloadCount: 0,
      reportScope: 'single'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      draft: 'outline',
      generated: 'secondary',
      published: 'default',
      archived: 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      student_terminal: 'Student Terminal',
      class_terminal: 'Class Terminal',
      subject_scoresheet: 'Subject Scoresheet',
      class_scoresheet: 'Class Scoresheet',
      performance_analysis: 'Performance Analysis',
      progress_report: 'Progress Report'
    }
    return <Badge variant="outline">{typeLabels[type] || type}</Badge>
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'excel':
        return <BarChart3 className="h-4 w-4 text-green-500" />
      case 'word':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'csv':
        return <FileText className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assessment Reports</h2>
          <p className="text-muted-foreground">
            Generate and manage academic performance reports and scoresheets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadSampleReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ButtonSpinner size="sm" className="mr-2" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Sample Report'}
          </Button>
          <Dialog open={isGenerateDialogOpen} onOpenChange={(open) => {
            setIsGenerateDialogOpen(open)
            if (!open) resetFormState()
          }}>
            <DialogTrigger asChild>
              <Button onClick={resetFormState}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Generate New Assessment Report</DialogTitle>
                <DialogDescription>
                  Create a new assessment report with specific parameters and criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title *</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Grade 1A Terminal Report - Mathematics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student_terminal">Student Terminal Report</SelectItem>
                        <SelectItem value="class_terminal">Class Terminal Report</SelectItem>
                        <SelectItem value="subject_scoresheet">Subject Scoresheet</SelectItem>
                        <SelectItem value="class_scoresheet">Class Scoresheet</SelectItem>
                        <SelectItem value="performance_analysis">Performance Analysis</SelectItem>
                        <SelectItem value="progress_report">Progress Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="term">Term *</Label>
                    <Select 
                      value={selectedTerm} 
                      onValueChange={(value) => {
                        setSelectedTerm(value)
                        setFormData(prev => ({ ...prev, term: value }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemData.terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Select
                      value={selectedAcademicYear}
                      onValueChange={(value) => {
                        setSelectedAcademicYear(value)
                        setFormData(prev => ({ ...prev, academicYear: value }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemData.academicYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher/Creator *</Label>
                    <Select
                      value={selectedTeacher}
                      onValueChange={(value) => {
                        setSelectedTeacher(value)
                        const teacher = systemData.teachers.find(t => t.id === value)
                        setFormData(prev => ({ ...prev, teacher: teacher?.name || '' }))
                        // Reset subject when teacher changes
                        setSelectedSubject('')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemData.teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="generated">Generated</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(formData.type === 'class_terminal' || formData.type === 'class_scoresheet') && (
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={selectedClass}
                      onValueChange={(value) => {
                        setSelectedClass(value)
                        const selectedClassData = systemData.classes.find(c => c.id === value)
                        setFormData(prev => ({ ...prev, class: selectedClassData?.name || '' }))
                        // Reset student when class changes
                        setSelectedStudent('')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(classesBySystem).map(([system, classes]) => (
                          <div key={system}>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground border-b mb-1">
                              {system === '8-4-4' ? '8-4-4 System (Secondary)' : 'CBC System'}
                            </div>
                            {classes.map((classData) => (
                              <SelectItem key={classData.id} value={classData.id}>
                                {classData.name} - {classData.level} ({classData.students} students)
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(formData.type === 'subject_scoresheet' || formData.type === 'class_terminal') && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={selectedSubject}
                      onValueChange={(value) => {
                        setSelectedSubject(value)
                        const subject = systemData.subjects.find(s => s.id === value)
                        setFormData(prev => ({ ...prev, subject: subject?.name || '' }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code}) - {subject.system} {subject.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(formData.type === 'student_terminal' || formData.type === 'progress_report') && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Report Scope</Label>
                      <Select 
                        value={formData.reportScope || 'single'} 
                        onValueChange={(value) => setFormData({...formData, reportScope: value, student: value === 'class' ? '' : formData.student})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Student</SelectItem>
                          <SelectItem value="class">Whole Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.reportScope !== 'class' && (
                      <div className="space-y-2">
                        <Label htmlFor="student">Student Name</Label>
                        <Select
                          value={selectedStudent}
                          onValueChange={(value) => {
                            setSelectedStudent(value)
                            const student = systemData.students.find(s => s.id === value)
                            setFormData(prev => ({ ...prev, student: student?.name || '' }))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} - {student.admissionNo} ({student.class})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {(formData.reportScope === 'class' || formData.type === 'progress_report') && (
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select
                          value={selectedClass}
                          onValueChange={(value) => {
                            setSelectedClass(value)
                            const selectedClassData = systemData.classes.find(c => c.id === value)
                            setFormData(prev => ({ ...prev, class: selectedClassData?.name || '' }))
                            // Reset student when class changes
                            setSelectedStudent('')
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(classesBySystem).map(([system, classes]) => (
                              <div key={system}>
                                <div className="px-2 py-1 text-sm font-semibold text-muted-foreground border-b mb-1">
                                  {system === '8-4-4' ? '8-4-4 System (Secondary)' : 'CBC System'}
                                </div>
                                {classes.map((classData) => (
                                  <SelectItem key={classData.id} value={classData.id}>
                                    {classData.name} - {classData.level} ({classData.students} students)
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the report"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsGenerateDialogOpen(false); resetForm()}}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating && <ButtonSpinner size="sm" className="mr-2" />}
                  {isGenerating ? 'Generating...' : 
                    formData.type === 'student_terminal' && formData.reportScope === 'class' ? 
                      'Generate Class Reports' : 'Generate Report'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter(r => r.status === 'published').length} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(reports.filter(r => r.avgScore).reduce((sum, r) => sum + (r.avgScore || 0), 0) / reports.filter(r => r.avgScore).length * 10) / 10}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Report downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(reports.filter(r => r.passRate).reduce((sum, r) => sum + (r.passRate || 0), 0) / reports.filter(r => r.passRate).length)}%
            </div>
            <p className="text-xs text-muted-foreground">Average pass rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports Directory</CardTitle>
              {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || termFilter !== 'all' || formatFilter !== 'all') && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {typeFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {typeFilter}
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {statusFilter}
                    </Badge>
                  )}
                  {termFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Term: {termFilter}
                    </Badge>
                  )}
                  {formatFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Format: {formatFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearchParams({ search: null, type: null, status: null, term: null, format: null, sortBy: null, sortOrder: null })}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => updateSearchParams({ search: e.target.value })}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={typeFilter} onValueChange={(value) => updateSearchParams({ type: value })}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="student_terminal">Student Terminal</SelectItem>
                  <SelectItem value="class_terminal">Class Terminal</SelectItem>
                  <SelectItem value="subject_scoresheet">Subject Scoresheet</SelectItem>
                  <SelectItem value="class_scoresheet">Class Scoresheet</SelectItem>
                  <SelectItem value="performance_analysis">Performance Analysis</SelectItem>
                  <SelectItem value="progress_report">Progress Report</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => updateSearchParams({ status: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={termFilter} onValueChange={(value) => updateSearchParams({ term: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="Term 1">Term 1</SelectItem>
                  <SelectItem value="Term 2">Term 2</SelectItem>
                  <SelectItem value="Term 3">Term 3</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-')
                updateSearchParams({ sortBy: newSortBy, sortOrder: newSortOrder })
              }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generatedDate-desc">Latest First</SelectItem>
                  <SelectItem value="generatedDate-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="avgScore-desc">Score High-Low</SelectItem>
                  <SelectItem value="avgScore-asc">Score Low-High</SelectItem>
                  <SelectItem value="downloadCount-desc">Most Downloaded</SelectItem>
                  <SelectItem value="teacher-asc">Teacher A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Term/Year</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        {getFormatIcon(report.format)}
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.class && <span>Class: {report.class}</span>}
                            {report.subject && <span> • Subject: {report.subject}</span>}
                            {report.student && <span>Student: {report.student}</span>}
                            {report.reportScope === 'class' && report.type === 'student_terminal' && (
                              <span className="text-blue-600 font-medium"> • Whole Class</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {report.teacher}
                            {report.fileSize && <span> • {report.fileSize}</span>}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(report.type)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.term}</div>
                        <div className="text-sm text-muted-foreground">{report.academicYear}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.avgScore && (
                        <div>
                          <div className="font-medium">{report.avgScore}% avg</div>
                          {report.passRate && (
                            <div className="text-sm text-muted-foreground">{report.passRate}% pass rate</div>
                          )}
                          {report.totalStudents && (
                            <div className="text-xs text-muted-foreground">{report.totalStudents} students</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(report.generatedDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{report.downloadCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                if (report.type === 'student_terminal') {
                                  handlePreviewReport(report.id)
                                } else {
                                  setViewingReport(report)
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Report Details</DialogTitle>
                            </DialogHeader>
                            {viewingReport && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Report Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Title:</strong> {viewingReport.title}</div>
                                        <div><strong>Type:</strong> {getTypeBadge(viewingReport.type)}</div>
                                        <div><strong>Description:</strong> {viewingReport.description}</div>
                                        <div><strong>Generated:</strong> {new Date(viewingReport.generatedDate).toLocaleDateString()}</div>
                                        <div><strong>Created by:</strong> {viewingReport.createdBy}</div>
                                        <div><strong>Status:</strong> {getStatusBadge(viewingReport.status)}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Academic Period
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Term:</strong> {viewingReport.term}</div>
                                        <div><strong>Academic Year:</strong> {viewingReport.academicYear}</div>
                                        {viewingReport.class && <div><strong>Class:</strong> {viewingReport.class}</div>}
                                        {viewingReport.subject && <div><strong>Subject:</strong> {viewingReport.subject}</div>}
                                        {viewingReport.student && <div><strong>Student:</strong> {viewingReport.student}</div>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    {viewingReport.avgScore && (
                                      <div>
                                        <h3 className="font-semibold flex items-center">
                                          <BarChart3 className="mr-2 h-4 w-4" />
                                          Performance Metrics
                                        </h3>
                                        <div className="mt-2 space-y-2 text-sm">
                                          <div><strong>Average Score:</strong> {viewingReport.avgScore}%</div>
                                          {viewingReport.highestScore && <div><strong>Highest Score:</strong> {viewingReport.highestScore}%</div>}
                                          {viewingReport.lowestScore && <div><strong>Lowest Score:</strong> {viewingReport.lowestScore}%</div>}
                                          {viewingReport.passRate && <div><strong>Pass Rate:</strong> {viewingReport.passRate}%</div>}
                                          {viewingReport.totalStudents && <div><strong>Total Students:</strong> {viewingReport.totalStudents}</div>}
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Download className="mr-2 h-4 w-4" />
                                        File Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex items-center">
                                          <strong>Format:</strong>
                                          <span className="ml-2 flex items-center">
                                            {getFormatIcon(viewingReport.format)}
                                            <span className="ml-1">{viewingReport.format.toUpperCase()}</span>
                                          </span>
                                        </div>
                                        {viewingReport.fileSize && <div><strong>File Size:</strong> {viewingReport.fileSize}</div>}
                                        <div><strong>Downloads:</strong> {viewingReport.downloadCount}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setViewingReport(null)}>
                                Close
                              </Button>
                              <Button>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4 text-blue-500" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{report.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {paginatedReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by generating your first report.'}
              </p>
              <div className="flex justify-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadSampleReport}
                  disabled={isGenerating}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Download Sample Report'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredReports.length)} of {filteredReports.length} reports
                </span>
                <Select 
                  value={pageSize.toString()} 
                  onValueChange={(value) => updateSearchParams({ pageSize: value, page: '1' })}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSearchParams({ page: (page - 1).toString() })}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(pageNum => {
                      return pageNum === 1 || 
                             pageNum === totalPages || 
                             Math.abs(pageNum - page) <= 1
                    })
                    .map((pageNum, index, array) => (
                      <div key={pageNum} className="flex items-center">
                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSearchParams({ page: pageNum.toString() })}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      </div>
                    ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSearchParams({ page: (page + 1).toString() })}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              Preview of the generated student terminal report
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-[70vh]">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Report Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsPreviewDialogOpen(false)
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl(null)
              }
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}