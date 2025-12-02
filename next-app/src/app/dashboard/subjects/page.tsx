'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  BookOpen,
  GraduationCap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Calendar,
  Target
} from 'lucide-react'

interface Subject {
  id: string
  name: string
  code: string // e.g., "MATH101", "ENG201"
  description: string
  department: string
  category: 'core' | 'elective' | 'extracurricular' | 'remedial'
  level: 'primary' | 'secondary' | 'advanced'
  creditHours: number
  weeklyHours: number
  prerequisites?: string[] // Subject IDs or names
  assessmentMethods: string[] // e.g., ["Exams", "Assignments", "Projects"]
  gradingScale: 'percentage' | 'letter' | 'points'
  maxMarks: number
  passingMarks: number
  teachers: string[] // Teacher IDs or names assigned to this subject
  classes: string[] // Class IDs where this subject is taught
  materials?: string[] // Textbooks, resources needed
  objectives: string[] // Learning objectives
  status: 'active' | 'inactive' | 'draft' | 'archived'
  academicYear: string
  createdAt: string
  updatedAt: string
}

// Mock data for subjects
const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Foundation mathematics covering algebra, geometry, and basic calculus',
    department: 'Mathematics',
    category: 'core',
    level: 'primary',
    creditHours: 4,
    weeklyHours: 6,
    prerequisites: [],
    assessmentMethods: ['Exams', 'Assignments', 'Class Tests'],
    gradingScale: 'percentage',
    maxMarks: 100,
    passingMarks: 40,
    teachers: ['Sarah Johnson', 'Michael Chen'],
    classes: ['Grade 1A', 'Grade 1B', 'Grade 2A'],
    materials: ['Mathematics Textbook Grade 1', 'Exercise Books', 'Calculator'],
    objectives: [
      'Understand basic arithmetic operations',
      'Solve simple word problems',
      'Recognize geometric shapes',
      'Develop logical thinking skills'
    ],
    status: 'active',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'English Language',
    code: 'ENG101',
    description: 'Comprehensive English language skills including reading, writing, speaking, and listening',
    department: 'Languages',
    category: 'core',
    level: 'primary',
    creditHours: 5,
    weeklyHours: 7,
    prerequisites: [],
    assessmentMethods: ['Exams', 'Essays', 'Oral Presentations', 'Reading Comprehension'],
    gradingScale: 'percentage',
    maxMarks: 100,
    passingMarks: 50,
    teachers: ['Emily Davis', 'John Smith'],
    classes: ['Grade 1A', 'Grade 1B', 'Grade 2A', 'Grade 3A'],
    materials: ['English Textbook', 'Dictionary', 'Reading Books', 'Writing Journal'],
    objectives: [
      'Develop reading fluency and comprehension',
      'Master basic grammar and vocabulary',
      'Express ideas clearly in writing',
      'Communicate effectively in spoken English'
    ],
    status: 'active',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Advanced Physics',
    code: 'PHY401',
    description: 'Advanced physics concepts including quantum mechanics and thermodynamics',
    department: 'Science',
    category: 'core',
    level: 'advanced',
    creditHours: 6,
    weeklyHours: 8,
    prerequisites: ['Basic Physics', 'Advanced Mathematics'],
    assessmentMethods: ['Exams', 'Lab Reports', 'Research Projects'],
    gradingScale: 'percentage',
    maxMarks: 100,
    passingMarks: 60,
    teachers: ['Dr. Robert Wilson'],
    classes: ['Form 4A', 'Form 4B'],
    materials: ['Advanced Physics Textbook', 'Lab Manual', 'Scientific Calculator'],
    objectives: [
      'Understand quantum mechanical principles',
      'Apply thermodynamic laws',
      'Conduct advanced physics experiments',
      'Analyze complex physical phenomena'
    ],
    status: 'active',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'Art & Crafts',
    code: 'ART201',
    description: 'Creative expression through various art forms and craft activities',
    department: 'Arts',
    category: 'elective',
    level: 'primary',
    creditHours: 2,
    weeklyHours: 3,
    prerequisites: [],
    assessmentMethods: ['Portfolio', 'Practical Work', 'Creative Projects'],
    gradingScale: 'letter',
    maxMarks: 100,
    passingMarks: 50,
    teachers: ['Lisa Anderson', 'Mark Thompson'],
    classes: ['Grade 3A', 'Grade 4A', 'Grade 5A'],
    materials: ['Art Supplies', 'Drawing Paper', 'Paints', 'Craft Materials'],
    objectives: [
      'Develop creative expression skills',
      'Learn various art techniques',
      'Appreciate different art forms',
      'Create original artworks'
    ],
    status: 'active',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '5',
    name: 'Computer Programming',
    code: 'CS301',
    description: 'Introduction to programming concepts and software development',
    department: 'Technology',
    category: 'elective',
    level: 'secondary',
    creditHours: 4,
    weeklyHours: 5,
    prerequisites: ['Basic Computer Skills'],
    assessmentMethods: ['Coding Projects', 'Exams', 'Portfolio'],
    gradingScale: 'percentage',
    maxMarks: 100,
    passingMarks: 55,
    teachers: ['Alex Chen', 'Maria Rodriguez'],
    classes: ['Form 2A', 'Form 3A'],
    materials: ['Programming Textbook', 'Computer Access', 'Software Tools'],
    objectives: [
      'Understand programming fundamentals',
      'Write efficient code',
      'Debug and test programs',
      'Develop problem-solving skills'
    ],
    status: 'active',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '6',
    name: 'Classical Literature',
    code: 'LIT501',
    description: 'Study of classical literary works and their historical context',
    department: 'Languages',
    category: 'elective',
    level: 'advanced',
    creditHours: 3,
    weeklyHours: 4,
    prerequisites: ['Advanced English'],
    assessmentMethods: ['Essays', 'Literary Analysis', 'Presentations'],
    gradingScale: 'letter',
    maxMarks: 100,
    passingMarks: 65,
    teachers: ['Prof. Jane Williams'],
    classes: [],
    materials: ['Classical Literature Collection', 'Critical Essays', 'Historical Context Books'],
    objectives: [
      'Analyze classical literary works',
      'Understand historical literary context',
      'Develop critical thinking skills',
      'Appreciate literary artistry'
    ],
    status: 'draft',
    academicYear: '2024-2025',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  }
]

export default function SubjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const searchTerm = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'
  const levelFilter = searchParams.get('level') || 'all'
  const departmentFilter = searchParams.get('department') || 'all'
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(mockSubjects)
  const [paginatedSubjects, setPaginatedSubjects] = useState<Subject[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState<Partial<Subject>>({
    status: 'active',
    category: 'core',
    level: 'primary',
    gradingScale: 'percentage',
    creditHours: 3,
    weeklyHours: 4,
    maxMarks: 100,
    passingMarks: 50,
    academicYear: '2024-2025',
    assessmentMethods: [],
    teachers: [],
    classes: [],
    objectives: [],
    prerequisites: [],
    materials: []
  })

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
    router.replace(`/dashboard/subjects${query}`, { scroll: false })
  }

  // Filter and sort subjects based on URL parameters
  useEffect(() => {
    let filtered = subjects

    if (searchTerm) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teachers.some(teacher => teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
        subject.classes.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(subject => subject.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(subject => subject.category === categoryFilter)
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(subject => subject.level === levelFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(subject => subject.department === departmentFilter)
    }

    // Sort subjects
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'code':
          aValue = a.code.toLowerCase()
          bValue = b.code.toLowerCase()
          break
        case 'department':
          aValue = a.department.toLowerCase()
          bValue = b.department.toLowerCase()
          break
        case 'creditHours':
          aValue = a.creditHours
          bValue = b.creditHours
          break
        case 'weeklyHours':
          aValue = a.weeklyHours
          bValue = b.weeklyHours
          break
        case 'classes':
          aValue = a.classes.length
          bValue = b.classes.length
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    setFilteredSubjects(filtered)
    
    // Calculate pagination
    const total = filtered.length
    const totalPagesCalc = Math.ceil(total / pageSize)
    setTotalPages(totalPagesCalc)
    
    // Get paginated results
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)
    setPaginatedSubjects(paginated)
    
  }, [subjects, searchTerm, statusFilter, categoryFilter, levelFilter, departmentFilter, sortBy, sortOrder, page, pageSize])

  const handleAddSubject = () => {
    if (!formData.name || !formData.code || !formData.department) {
      alert('Please fill in all required fields')
      return
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description || '',
      department: formData.department,
      category: formData.category as any,
      level: formData.level as any,
      creditHours: formData.creditHours || 3,
      weeklyHours: formData.weeklyHours || 4,
      prerequisites: formData.prerequisites || [],
      assessmentMethods: formData.assessmentMethods || [],
      gradingScale: formData.gradingScale as any,
      maxMarks: formData.maxMarks || 100,
      passingMarks: formData.passingMarks || 50,
      teachers: formData.teachers || [],
      classes: formData.classes || [],
      materials: formData.materials || [],
      objectives: formData.objectives || [],
      status: formData.status as any,
      academicYear: formData.academicYear || '2024-2025',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSubjects([...subjects, newSubject])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditSubject = () => {
    if (!editingSubject || !formData.name || !formData.code || !formData.department) {
      alert('Please fill in all required fields')
      return
    }

    const updatedSubject = {
      ...editingSubject,
      ...formData,
      updatedAt: new Date().toISOString()
    } as Subject

    setSubjects(subjects.map(s => s.id === editingSubject.id ? updatedSubject : s))
    setEditingSubject(null)
    resetForm()
  }

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId))
  }

  const resetForm = () => {
    setFormData({
      status: 'active',
      category: 'core',
      level: 'primary',
      gradingScale: 'percentage',
      creditHours: 3,
      weeklyHours: 4,
      maxMarks: 100,
      passingMarks: 50,
      academicYear: '2024-2025',
      assessmentMethods: [],
      teachers: [],
      classes: [],
      objectives: [],
      prerequisites: [],
      materials: []
    })
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData(subject)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      active: 'default',
      inactive: 'secondary',
      draft: 'outline',
      archived: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      core: 'default',
      elective: 'secondary',
      extracurricular: 'outline',
      remedial: 'destructive'
    }
    return <Badge variant={variants[category] || 'secondary'}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
  }

  const uniqueDepartments = Array.from(new Set(subjects.map(s => s.department))).filter(Boolean)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">
            Manage curriculum subjects and learning objectives
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject with curriculum details and learning objectives.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Subject Name *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Mathematics, English, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Subject Code *</Label>
                    <Input
                      id="code"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="MATH101, ENG201, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="Mathematics, Science, Languages, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear || ''}
                      onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                      placeholder="2024-2025"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category || 'core'} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core</SelectItem>
                        <SelectItem value="elective">Elective</SelectItem>
                        <SelectItem value="extracurricular">Extracurricular</SelectItem>
                        <SelectItem value="remedial">Remedial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level || 'primary'} onValueChange={(value) => setFormData({...formData, level: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditHours">Credit Hours</Label>
                    <Input
                      id="creditHours"
                      type="number"
                      min="1"
                      value={formData.creditHours || ''}
                      onChange={(e) => setFormData({...formData, creditHours: parseInt(e.target.value) || 3})}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weeklyHours">Weekly Hours</Label>
                    <Input
                      id="weeklyHours"
                      type="number"
                      min="1"
                      value={formData.weeklyHours || ''}
                      onChange={(e) => setFormData({...formData, weeklyHours: parseInt(e.target.value) || 4})}
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMarks">Max Marks</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      min="1"
                      value={formData.maxMarks || ''}
                      onChange={(e) => setFormData({...formData, maxMarks: parseInt(e.target.value) || 100})}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingMarks">Passing Marks</Label>
                    <Input
                      id="passingMarks"
                      type="number"
                      min="1"
                      value={formData.passingMarks || ''}
                      onChange={(e) => setFormData({...formData, passingMarks: parseInt(e.target.value) || 50})}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the subject"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm()}}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {subjects.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments.length}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Credit Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(subjects.reduce((sum, s) => sum + s.creditHours, 0) / subjects.length * 10) / 10}
            </div>
            <p className="text-xs text-muted-foreground">Per subject</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Subjects</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.filter(s => s.category === 'core').length}</div>
            <p className="text-xs text-muted-foreground">Required subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subjects Directory</CardTitle>
              {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || levelFilter !== 'all' || departmentFilter !== 'all') && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Status: {statusFilter}
                    </Badge>
                  )}
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {levelFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Level: {levelFilter}
                    </Badge>
                  )}
                  {departmentFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Department: {departmentFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearchParams({ search: null, status: null, category: null, level: null, department: null, sortBy: null, sortOrder: null })}
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
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => updateSearchParams({ search: e.target.value })}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => updateSearchParams({ status: value })}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={(value) => updateSearchParams({ category: value })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="extracurricular">Extracurricular</SelectItem>
                  <SelectItem value="remedial">Remedial</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(value) => updateSearchParams({ level: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={(value) => updateSearchParams({ department: value })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
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
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="code-asc">Code A-Z</SelectItem>
                  <SelectItem value="code-desc">Code Z-A</SelectItem>
                  <SelectItem value="department-asc">Department A-Z</SelectItem>
                  <SelectItem value="department-desc">Department Z-A</SelectItem>
                  <SelectItem value="creditHours-asc">Credit Hours ↑</SelectItem>
                  <SelectItem value="creditHours-desc">Credit Hours ↓</SelectItem>
                  <SelectItem value="weeklyHours-asc">Weekly Hours ↑</SelectItem>
                  <SelectItem value="weeklyHours-desc">Weekly Hours ↓</SelectItem>
                  <SelectItem value="classes-asc">Classes ↑</SelectItem>
                  <SelectItem value="classes-desc">Classes ↓</SelectItem>
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
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'name', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Subject
                      {sortBy === 'name' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'department' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'department', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Department
                      {sortBy === 'department' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'creditHours' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'creditHours', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Credits
                      {sortBy === 'creditHours' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'classes' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'classes', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Classes
                      {sortBy === 'classes' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-muted-foreground">{subject.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.department}</Badge>
                    </TableCell>
                    <TableCell>{getCategoryBadge(subject.category)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subject.level.charAt(0).toUpperCase() + subject.level.slice(1)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subject.creditHours} hrs</div>
                        <div className="text-sm text-muted-foreground">{subject.weeklyHours}/week</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subject.classes.length} classes</div>
                        <div className="text-sm text-muted-foreground">{subject.teachers.length} teachers</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(subject.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setViewingSubject(subject)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Subject Details</DialogTitle>
                            </DialogHeader>
                            {viewingSubject && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Subject Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewingSubject.name}</div>
                                        <div><strong>Code:</strong> {viewingSubject.code}</div>
                                        <div><strong>Department:</strong> {viewingSubject.department}</div>
                                        <div><strong>Category:</strong> {getCategoryBadge(viewingSubject.category)}</div>
                                        <div><strong>Level:</strong> {viewingSubject.level.charAt(0).toUpperCase() + viewingSubject.level.slice(1)}</div>
                                        <div><strong>Status:</strong> {getStatusBadge(viewingSubject.status)}</div>
                                        <div><strong>Academic Year:</strong> {viewingSubject.academicYear}</div>
                                        {viewingSubject.description && (
                                          <div><strong>Description:</strong> {viewingSubject.description}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Course Details
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Credit Hours:</strong> {viewingSubject.creditHours}</div>
                                        <div><strong>Weekly Hours:</strong> {viewingSubject.weeklyHours}</div>
                                        <div><strong>Max Marks:</strong> {viewingSubject.maxMarks}</div>
                                        <div><strong>Passing Marks:</strong> {viewingSubject.passingMarks}</div>
                                        <div><strong>Grading:</strong> {viewingSubject.gradingScale.charAt(0).toUpperCase() + viewingSubject.gradingScale.slice(1)}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Target className="mr-2 h-4 w-4" />
                                        Assessment Methods
                                      </h3>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {viewingSubject.assessmentMethods.map((method, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {method}
                                          </Badge>
                                        ))}
                                        {viewingSubject.assessmentMethods.length === 0 && (
                                          <span className="text-sm text-muted-foreground">No assessment methods defined</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        Classes & Teachers
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Classes:</strong> {viewingSubject.classes.length}</div>
                                        <div className="flex flex-wrap gap-1">
                                          {viewingSubject.classes.map((cls, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {cls}
                                            </Badge>
                                          ))}
                                        </div>
                                        <div><strong>Teachers:</strong> {viewingSubject.teachers.length}</div>
                                        <div className="flex flex-wrap gap-1">
                                          {viewingSubject.teachers.map((teacher, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                              {teacher}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Learning Objectives
                                      </h3>
                                      <div className="mt-2 text-sm">
                                        {viewingSubject.objectives.length > 0 ? (
                                          <ul className="list-disc list-inside space-y-1">
                                            {viewingSubject.objectives.map((objective, index) => (
                                              <li key={index}>{objective}</li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <span className="text-muted-foreground">No learning objectives defined</span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Prerequisites</h3>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {viewingSubject.prerequisites && viewingSubject.prerequisites.length > 0 ? (
                                          viewingSubject.prerequisites.map((prereq, index) => (
                                            <Badge key={index} variant="destructive" className="text-xs">
                                              {prereq}
                                            </Badge>
                                          ))
                                        ) : (
                                          <span className="text-sm text-muted-foreground">No prerequisites</span>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Materials</h3>
                                      <div className="mt-2 text-sm">
                                        {viewingSubject.materials && viewingSubject.materials.length > 0 ? (
                                          <ul className="list-disc list-inside space-y-1">
                                            {viewingSubject.materials.map((material, index) => (
                                              <li key={index}>{material}</li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <span className="text-muted-foreground">No materials listed</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editingSubject?.id === subject.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingSubject(null)
                            resetForm()
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(subject)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Subject</DialogTitle>
                              <DialogDescription>
                                Update subject information and details.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Subject Name *</Label>
                                  <Input
                                    id="edit-name"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-code">Subject Code *</Label>
                                  <Input
                                    id="edit-code"
                                    value={formData.code || ''}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-department">Department *</Label>
                                  <Input
                                    id="edit-department"
                                    value={formData.department || ''}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="draft">Draft</SelectItem>
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-category">Category</Label>
                                  <Select value={formData.category || 'core'} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="core">Core</SelectItem>
                                      <SelectItem value="elective">Elective</SelectItem>
                                      <SelectItem value="extracurricular">Extracurricular</SelectItem>
                                      <SelectItem value="remedial">Remedial</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-level">Level</Label>
                                  <Select value={formData.level || 'primary'} onValueChange={(value) => setFormData({...formData, level: value as any})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="primary">Primary</SelectItem>
                                      <SelectItem value="secondary">Secondary</SelectItem>
                                      <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-creditHours">Credit Hours</Label>
                                  <Input
                                    id="edit-creditHours"
                                    type="number"
                                    min="1"
                                    value={formData.creditHours || ''}
                                    onChange={(e) => setFormData({...formData, creditHours: parseInt(e.target.value) || 3})}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {setEditingSubject(null); resetForm()}}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditSubject}>Update Subject</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {subject.name} ({subject.code})? 
                                This action cannot be undone and will affect all related classes and assessments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteSubject(subject.id)}
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
          {paginatedSubjects.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No subjects found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first subject.'}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredSubjects.length)} of {filteredSubjects.length} subjects
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
    </div>
  )
}