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
  Users,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  School,
  UserCheck,
  Clock,
  Calendar
} from 'lucide-react'

interface Class {
  id: string
  name: string // e.g., "Grade 1", "Form 4", "PP1"
  section: string // e.g., "A", "B", "C"
  level: string // e.g., "Primary", "Secondary", "Pre-Primary"
  classType: 'grade' | 'form' | 'pp' | 'nursery' | 'kindergarten'
  classNumber: number // 1, 2, 3, etc.
  classTeacherId?: string
  classTeacherName?: string
  maxStudents: number
  currentStudents: number
  subjects: string[]
  classroom: string // Room number/name
  academicYear: string
  schedule: {
    startTime: string
    endTime: string
    days: string[]
  }
  status: 'active' | 'inactive' | 'archived'
  description?: string
  createdAt: string
  updatedAt: string
}

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Grade 1',
    section: 'A',
    level: 'Primary',
    classType: 'grade',
    classNumber: 1,
    classTeacherId: 'TCH001',
    classTeacherName: 'Sarah Johnson',
    maxStudents: 30,
    currentStudents: 28,
    subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art'],
    classroom: 'Room 101',
    academicYear: '2024-2025',
    schedule: {
      startTime: '08:00',
      endTime: '14:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'active',
    description: 'Foundation class for primary education',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Grade 1',
    section: 'B',
    level: 'Primary',
    classType: 'grade',
    classNumber: 1,
    classTeacherId: 'TCH002',
    classTeacherName: 'Michael Chen',
    maxStudents: 30,
    currentStudents: 25,
    subjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art'],
    classroom: 'Room 102',
    academicYear: '2024-2025',
    schedule: {
      startTime: '08:00',
      endTime: '14:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'active',
    description: 'Foundation class for primary education',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Form 4',
    section: 'A',
    level: 'Secondary',
    classType: 'form',
    classNumber: 4,
    classTeacherId: 'TCH003',
    classTeacherName: 'Emily Davis',
    maxStudents: 35,
    currentStudents: 32,
    subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'],
    classroom: 'Room 201',
    academicYear: '2024-2025',
    schedule: {
      startTime: '07:30',
      endTime: '15:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'active',
    description: 'Advanced secondary education class',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'PP1',
    section: 'A',
    level: 'Pre-Primary',
    classType: 'pp',
    classNumber: 1,
    classTeacherId: 'TCH004',
    classTeacherName: 'David Wilson',
    maxStudents: 20,
    currentStudents: 18,
    subjects: ['Basic Literacy', 'Basic Numeracy', 'Creative Arts', 'Physical Education'],
    classroom: 'Room 001',
    academicYear: '2024-2025',
    schedule: {
      startTime: '09:00',
      endTime: '12:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'active',
    description: 'Pre-primary foundation class',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '5',
    name: 'PP2',
    section: 'A',
    level: 'Pre-Primary',
    classType: 'pp',
    classNumber: 2,
    classTeacherId: 'TCH005',
    classTeacherName: 'Lisa Anderson',
    maxStudents: 20,
    currentStudents: 19,
    subjects: ['Basic Literacy', 'Basic Numeracy', 'Creative Arts', 'Physical Education', 'Environmental Studies'],
    classroom: 'Room 002',
    academicYear: '2024-2025',
    schedule: {
      startTime: '09:00',
      endTime: '12:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'active',
    description: 'Advanced pre-primary class',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '6',
    name: 'Grade 12',
    section: 'A',
    level: 'Secondary',
    classType: 'grade',
    classNumber: 12,
    maxStudents: 35,
    currentStudents: 0,
    subjects: ['Advanced Mathematics', 'Advanced English', 'Physics', 'Chemistry', 'Biology'],
    classroom: 'Room 301',
    academicYear: '2023-2024',
    schedule: {
      startTime: '07:30',
      endTime: '15:30',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    status: 'archived',
    description: 'Graduated class - archived for records',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  }
]

export default function ClassesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const searchTerm = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const levelFilter = searchParams.get('level') || 'all'
  const typeFilter = searchParams.get('type') || 'all'
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [filteredClasses, setFilteredClasses] = useState<Class[]>(mockClasses)
  const [paginatedClasses, setPaginatedClasses] = useState<Class[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [viewingClass, setViewingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState<Partial<Class>>({
    status: 'active',
    classType: 'grade',
    level: 'Primary',
    maxStudents: 30,
    currentStudents: 0,
    academicYear: '2024-2025',
    subjects: [],
    schedule: {
      startTime: '08:00',
      endTime: '14:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
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
    router.replace(`/dashboard/classes${query}`, { scroll: false })
  }

  // Generate class name based on type and number
  const generateClassName = (type: string, number: number) => {
    switch (type) {
      case 'grade':
        return `Grade ${number}`
      case 'form':
        return `Form ${number}`
      case 'pp':
        return `PP${number}`
      case 'nursery':
        return `Nursery ${number}`
      case 'kindergarten':
        return `K${number}`
      default:
        return `Class ${number}`
    }
  }

  // Filter and sort classes based on URL parameters
  useEffect(() => {
    let filtered = classes

    if (searchTerm) {
      filtered = filtered.filter(classItem =>
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.classTeacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.status === statusFilter)
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.level === levelFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.classType === typeFilter)
    }

    // Sort classes
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'name':
          // Sort by class type first, then by number, then by section
          aValue = `${a.classType}-${a.classNumber.toString().padStart(2, '0')}-${a.section}`
          bValue = `${b.classType}-${b.classNumber.toString().padStart(2, '0')}-${b.section}`
          break
        case 'level':
          aValue = a.level.toLowerCase()
          bValue = b.level.toLowerCase()
          break
        case 'students':
          aValue = a.currentStudents
          bValue = b.currentStudents
          break
        case 'capacity':
          aValue = (a.currentStudents / a.maxStudents) * 100
          bValue = (b.currentStudents / b.maxStudents) * 100
          break
        case 'teacher':
          aValue = a.classTeacherName?.toLowerCase() || 'zzz'
          bValue = b.classTeacherName?.toLowerCase() || 'zzz'
          break
        default:
          aValue = `${a.classType}-${a.classNumber.toString().padStart(2, '0')}-${a.section}`
          bValue = `${b.classType}-${b.classNumber.toString().padStart(2, '0')}-${b.section}`
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    setFilteredClasses(filtered)
    
    // Calculate pagination
    const total = filtered.length
    const totalPagesCalc = Math.ceil(total / pageSize)
    setTotalPages(totalPagesCalc)
    
    // Get paginated results
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)
    setPaginatedClasses(paginated)
    
  }, [classes, searchTerm, statusFilter, levelFilter, typeFilter, sortBy, sortOrder, page, pageSize])

  const handleAddClass = () => {
    if (!formData.classType || !formData.classNumber || !formData.section || !formData.level) {
      alert('Please fill in all required fields')
      return
    }

    const className = generateClassName(formData.classType, formData.classNumber)

    const newClass: Class = {
      id: Date.now().toString(),
      name: className,
      section: formData.section,
      level: formData.level,
      classType: formData.classType as any,
      classNumber: formData.classNumber,
      classTeacherId: formData.classTeacherId,
      classTeacherName: formData.classTeacherName,
      maxStudents: formData.maxStudents || 30,
      currentStudents: formData.currentStudents || 0,
      subjects: formData.subjects || [],
      classroom: formData.classroom || '',
      academicYear: formData.academicYear || '2024-2025',
      schedule: formData.schedule || {
        startTime: '08:00',
        endTime: '14:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      status: formData.status as any,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setClasses([...classes, newClass])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditClass = () => {
    if (!editingClass || !formData.classType || !formData.classNumber || !formData.section || !formData.level) {
      alert('Please fill in all required fields')
      return
    }

    const className = generateClassName(formData.classType!, formData.classNumber!)

    const updatedClass = {
      ...editingClass,
      ...formData,
      name: className,
      updatedAt: new Date().toISOString()
    } as Class

    setClasses(classes.map(c => c.id === editingClass.id ? updatedClass : c))
    setEditingClass(null)
    resetForm()
  }

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId))
  }

  const resetForm = () => {
    setFormData({
      status: 'active',
      classType: 'grade',
      level: 'Primary',
      maxStudents: 30,
      currentStudents: 0,
      academicYear: '2024-2025',
      subjects: [],
      schedule: {
        startTime: '08:00',
        endTime: '14:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    })
  }

  const openEditDialog = (classItem: Class) => {
    setEditingClass(classItem)
    setFormData(classItem)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      active: 'default',
      inactive: 'secondary',
      archived: 'outline'
    }
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const uniqueLevels = Array.from(new Set(classes.map(c => c.level))).filter(Boolean)
  const uniqueTypes = Array.from(new Set(classes.map(c => c.classType))).filter(Boolean)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage class structures and student enrollment
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
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Set up a new class with students, subjects, and schedule information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classType">Class Type *</Label>
                    <Select 
                      value={formData.classType || 'grade'} 
                      onValueChange={(value) => {
                        setFormData({...formData, classType: value as any})
                        // Auto-generate name when type or number changes
                        if (formData.classNumber) {
                          const newName = generateClassName(value, formData.classNumber)
                          setFormData(prev => ({...prev, classType: value as any, name: newName}))
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade">Grade</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                        <SelectItem value="pp">Pre-Primary (PP)</SelectItem>
                        <SelectItem value="nursery">Nursery</SelectItem>
                        <SelectItem value="kindergarten">Kindergarten (K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classNumber">Number *</Label>
                    <Input
                      id="classNumber"
                      type="number"
                      min="1"
                      value={formData.classNumber || ''}
                      onChange={(e) => {
                        const number = parseInt(e.target.value)
                        setFormData({...formData, classNumber: number})
                        // Auto-generate name when type or number changes
                        if (formData.classType) {
                          const newName = generateClassName(formData.classType, number)
                          setFormData(prev => ({...prev, classNumber: number, name: newName}))
                        }
                      }}
                      placeholder="1, 2, 3..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section *</Label>
                    <Input
                      id="section"
                      value={formData.section || ''}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      placeholder="A, B, C..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select value={formData.level || 'Primary'} onValueChange={(value) => setFormData({...formData, level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-Primary">Pre-Primary</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Max Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      min="1"
                      value={formData.maxStudents || ''}
                      onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value) || 30})}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classroom">Classroom</Label>
                    <Input
                      id="classroom"
                      value={formData.classroom || ''}
                      onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                      placeholder="Room 101, Lab A, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classTeacherName">Class Teacher</Label>
                    <Input
                      id="classTeacherName"
                      value={formData.classTeacherName || ''}
                      onChange={(e) => setFormData({...formData, classTeacherName: e.target.value})}
                      placeholder="Teacher name"
                    />
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
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the class"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm()}}>
                  Cancel
                </Button>
                <Button onClick={handleAddClass}>Create Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              {classes.filter(c => c.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, c) => sum + c.currentStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Class Size</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(classes.reduce((sum, c) => sum + c.currentStudents, 0) / classes.filter(c => c.status === 'active').length)}
            </div>
            <p className="text-xs text-muted-foreground">Students per class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((classes.reduce((sum, c) => sum + c.currentStudents, 0) / classes.reduce((sum, c) => sum + c.maxStudents, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Overall capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classes Directory</CardTitle>
              {(searchTerm || statusFilter !== 'all' || levelFilter !== 'all' || typeFilter !== 'all') && (
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
                  {levelFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Level: {levelFilter}
                    </Badge>
                  )}
                  {typeFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Type: {typeFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearchParams({ search: null, status: null, level: null, type: null, sortBy: null, sortOrder: null })}
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
                  placeholder="Search classes..."
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
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(value) => updateSearchParams({ level: value })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(value) => updateSearchParams({ type: value })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
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
                  <SelectItem value="name-asc">Class A-Z</SelectItem>
                  <SelectItem value="name-desc">Class Z-A</SelectItem>
                  <SelectItem value="level-asc">Level A-Z</SelectItem>
                  <SelectItem value="level-desc">Level Z-A</SelectItem>
                  <SelectItem value="students-asc">Students ↑</SelectItem>
                  <SelectItem value="students-desc">Students ↓</SelectItem>
                  <SelectItem value="capacity-asc">Capacity ↑</SelectItem>
                  <SelectItem value="capacity-desc">Capacity ↓</SelectItem>
                  <SelectItem value="teacher-asc">Teacher A-Z</SelectItem>
                  <SelectItem value="teacher-desc">Teacher Z-A</SelectItem>
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
                      Class
                      {sortBy === 'name' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'students' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'students', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Students
                      {sortBy === 'students' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'teacher' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'teacher', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Class Teacher
                      {sortBy === 'teacher' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Classroom</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classItem.name} - {classItem.section}</div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.classType.charAt(0).toUpperCase() + classItem.classType.slice(1)} {classItem.classNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{classItem.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={`font-medium ${getCapacityColor(classItem.currentStudents, classItem.maxStudents)}`}>
                          {classItem.currentStudents}/{classItem.maxStudents}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((classItem.currentStudents / classItem.maxStudents) * 100)}% capacity
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classItem.classTeacherName || 'Unassigned'}</div>
                        {classItem.classTeacherId && (
                          <div className="text-sm text-muted-foreground">ID: {classItem.classTeacherId}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {classItem.classroom || 'Not assigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{classItem.schedule.startTime} - {classItem.schedule.endTime}</div>
                        <div className="text-muted-foreground">
                          {classItem.schedule.days.length} days/week
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setViewingClass(classItem)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Class Details</DialogTitle>
                            </DialogHeader>
                            {viewingClass && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <School className="mr-2 h-4 w-4" />
                                        Class Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewingClass.name} - {viewingClass.section}</div>
                                        <div><strong>Level:</strong> {viewingClass.level}</div>
                                        <div><strong>Type:</strong> {viewingClass.classType.charAt(0).toUpperCase() + viewingClass.classType.slice(1)}</div>
                                        <div><strong>Academic Year:</strong> {viewingClass.academicYear}</div>
                                        <div><strong>Classroom:</strong> {viewingClass.classroom || 'Not assigned'}</div>
                                        <div><strong>Status:</strong> {getStatusBadge(viewingClass.status)}</div>
                                        {viewingClass.description && (
                                          <div><strong>Description:</strong> {viewingClass.description}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Subjects
                                      </h3>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {viewingClass.subjects.map((subject, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {subject}
                                          </Badge>
                                        ))}
                                        {viewingClass.subjects.length === 0 && (
                                          <span className="text-sm text-muted-foreground">No subjects assigned</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        Enrollment
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Current Students:</strong> {viewingClass.currentStudents}</div>
                                        <div><strong>Max Capacity:</strong> {viewingClass.maxStudents}</div>
                                        <div><strong>Capacity Used:</strong> {Math.round((viewingClass.currentStudents / viewingClass.maxStudents) * 100)}%</div>
                                        <div><strong>Available Spots:</strong> {viewingClass.maxStudents - viewingClass.currentStudents}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Class Teacher
                                      </h3>
                                      <div className="mt-2 text-sm">
                                        <div><strong>Name:</strong> {viewingClass.classTeacherName || 'Not assigned'}</div>
                                        {viewingClass.classTeacherId && (
                                          <div><strong>Employee ID:</strong> {viewingClass.classTeacherId}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Schedule
                                      </h3>
                                      <div className="mt-2 text-sm">
                                        <div><strong>Time:</strong> {viewingClass.schedule.startTime} - {viewingClass.schedule.endTime}</div>
                                        <div><strong>Days:</strong> {viewingClass.schedule.days.join(', ')}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editingClass?.id === classItem.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingClass(null)
                            resetForm()
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(classItem)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Class</DialogTitle>
                              <DialogDescription>
                                Update class information and settings.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-classType">Class Type</Label>
                                  <Select 
                                    value={formData.classType || 'grade'} 
                                    onValueChange={(value) => setFormData({...formData, classType: value as any})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="grade">Grade</SelectItem>
                                      <SelectItem value="form">Form</SelectItem>
                                      <SelectItem value="pp">Pre-Primary (PP)</SelectItem>
                                      <SelectItem value="nursery">Nursery</SelectItem>
                                      <SelectItem value="kindergarten">Kindergarten (K)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-classNumber">Number</Label>
                                  <Input
                                    id="edit-classNumber"
                                    type="number"
                                    min="1"
                                    value={formData.classNumber || ''}
                                    onChange={(e) => setFormData({...formData, classNumber: parseInt(e.target.value)})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-section">Section</Label>
                                  <Input
                                    id="edit-section"
                                    value={formData.section || ''}
                                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-maxStudents">Max Students</Label>
                                  <Input
                                    id="edit-maxStudents"
                                    type="number"
                                    min="1"
                                    value={formData.maxStudents || ''}
                                    onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value) || 30})}
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
                                      <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {setEditingClass(null); resetForm()}}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditClass}>Update Class</Button>
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
                              <AlertDialogTitle>Delete Class</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {classItem.name} - {classItem.section}? 
                                This action cannot be undone and will affect all enrolled students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteClass(classItem.id)}
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
          {paginatedClasses.length === 0 && (
            <div className="text-center py-8">
              <School className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No classes found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first class.'}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredClasses.length)} of {filteredClasses.length} classes
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