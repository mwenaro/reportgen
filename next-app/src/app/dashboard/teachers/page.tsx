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
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Award,
  Mail
} from 'lucide-react'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: string
  employeeId: string
  department: string
  subjects: string[]
  qualification: string
  experience: number // years
  joiningDate: string
  status: 'active' | 'inactive' | 'on-leave' | 'retired'
  salary: number
  emergencyContact: string
  emergencyContactName: string
  bloodGroup?: string
  designation: 'teacher' | 'senior-teacher' | 'head-teacher' | 'principal' | 'vice-principal'
  classTeacher?: string // class they are class teacher for
  createdAt: string
  updatedAt: string
}

// Mock data for teachers
const mockTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1-234-567-8901',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    address: '123 Oak Street, Springfield, IL 62701',
    employeeId: 'TCH001',
    department: 'Mathematics',
    subjects: ['Algebra', 'Geometry', 'Calculus'],
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: 8,
    joiningDate: '2016-08-01',
    status: 'active',
    salary: 55000,
    emergencyContact: '+1-234-567-8900',
    emergencyContactName: 'John Johnson',
    bloodGroup: 'O+',
    designation: 'senior-teacher',
    classTeacher: 'Grade 12A',
    createdAt: '2016-08-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@school.edu',
    phone: '+1-234-567-8902',
    dateOfBirth: '1980-07-22',
    gender: 'male',
    address: '456 Pine Avenue, Springfield, IL 62702',
    employeeId: 'TCH002',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    qualification: 'M.Sc. Physics, B.Ed.',
    experience: 12,
    joiningDate: '2012-08-01',
    status: 'active',
    salary: 62000,
    emergencyContact: '+1-234-567-8903',
    emergencyContactName: 'Lisa Chen',
    bloodGroup: 'A+',
    designation: 'head-teacher',
    classTeacher: 'Grade 11B',
    createdAt: '2012-08-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@school.edu',
    phone: '+1-234-567-8904',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    address: '789 Maple Drive, Springfield, IL 62703',
    employeeId: 'TCH003',
    department: 'English',
    subjects: ['English Literature', 'Creative Writing'],
    qualification: 'M.A. English Literature, B.Ed.',
    experience: 5,
    joiningDate: '2019-08-01',
    status: 'active',
    salary: 48000,
    emergencyContact: '+1-234-567-8905',
    emergencyContactName: 'Robert Davis',
    bloodGroup: 'B+',
    designation: 'teacher',
    createdAt: '2019-08-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@school.edu',
    phone: '+1-234-567-8906',
    dateOfBirth: '1978-05-30',
    gender: 'male',
    address: '321 Elm Street, Springfield, IL 62704',
    employeeId: 'TCH004',
    department: 'Social Studies',
    subjects: ['History', 'Geography', 'Civics'],
    qualification: 'M.A. History, B.Ed.',
    experience: 15,
    joiningDate: '2009-08-01',
    status: 'on-leave',
    salary: 58000,
    emergencyContact: '+1-234-567-8907',
    emergencyContactName: 'Susan Wilson',
    bloodGroup: 'AB+',
    designation: 'senior-teacher',
    classTeacher: 'Grade 10A',
    createdAt: '2009-08-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  }
]

export default function TeachersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const searchTerm = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const departmentFilter = searchParams.get('department') || 'all'
  const designationFilter = searchParams.get('designation') || 'all'
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(mockTeachers)
  const [paginatedTeachers, setPaginatedTeachers] = useState<Teacher[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState<Partial<Teacher>>({
    status: 'active',
    gender: 'male',
    designation: 'teacher',
    subjects: []
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
    router.replace(`/dashboard/teachers${query}`, { scroll: false })
  }

  // Filter and sort teachers based on URL parameters
  useEffect(() => {
    let filtered = teachers

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.includes(searchTerm) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.department === departmentFilter)
    }

    if (designationFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.designation === designationFilter)
    }

    // Sort teachers
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'employeeId':
          aValue = a.employeeId
          bValue = b.employeeId
          break
        case 'department':
          aValue = a.department.toLowerCase()
          bValue = b.department.toLowerCase()
          break
        case 'experience':
          aValue = a.experience
          bValue = b.experience
          break
        case 'joiningDate':
          aValue = new Date(a.joiningDate).getTime()
          bValue = new Date(b.joiningDate).getTime()
          break
        case 'salary':
          aValue = a.salary
          bValue = b.salary
          break
        default:
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    setFilteredTeachers(filtered)
    
    // Calculate pagination
    const total = filtered.length
    const totalPagesCalc = Math.ceil(total / pageSize)
    setTotalPages(totalPagesCalc)
    
    // Get paginated results
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)
    setPaginatedTeachers(paginated)
    
  }, [teachers, searchTerm, statusFilter, departmentFilter, designationFilter, sortBy, sortOrder, page, pageSize])

  const handleAddTeacher = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.employeeId) {
      alert('Please fill in all required fields')
      return
    }

    const newTeacher: Teacher = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender as 'male' | 'female' | 'other',
      address: formData.address || '',
      employeeId: formData.employeeId,
      department: formData.department || '',
      subjects: formData.subjects || [],
      qualification: formData.qualification || '',
      experience: formData.experience || 0,
      joiningDate: formData.joiningDate || new Date().toISOString().split('T')[0],
      status: formData.status as 'active' | 'inactive' | 'on-leave' | 'retired',
      salary: formData.salary || 0,
      emergencyContact: formData.emergencyContact || '',
      emergencyContactName: formData.emergencyContactName || '',
      bloodGroup: formData.bloodGroup,
      designation: formData.designation as 'teacher' | 'senior-teacher' | 'head-teacher' | 'principal' | 'vice-principal',
      classTeacher: formData.classTeacher,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTeachers([...teachers, newTeacher])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditTeacher = () => {
    if (!editingTeacher || !formData.firstName || !formData.lastName || !formData.email || !formData.employeeId) {
      alert('Please fill in all required fields')
      return
    }

    const updatedTeacher = {
      ...editingTeacher,
      ...formData,
      updatedAt: new Date().toISOString()
    } as Teacher

    setTeachers(teachers.map(t => t.id === editingTeacher.id ? updatedTeacher : t))
    setEditingTeacher(null)
    resetForm()
  }

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(t => t.id !== teacherId))
  }

  const resetForm = () => {
    setFormData({
      status: 'active',
      gender: 'male',
      designation: 'teacher',
      subjects: []
    })
  }

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData(teacher)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      active: 'default',
      inactive: 'secondary',
      'on-leave': 'outline',
      retired: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}</Badge>
  }

  const getDesignationBadge = (designation: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      teacher: 'secondary',
      'senior-teacher': 'default',
      'head-teacher': 'outline',
      principal: 'destructive',
      'vice-principal': 'destructive'
    }
    return <Badge variant={variants[designation] || 'secondary'}>{designation.replace('-', ' ').charAt(0).toUpperCase() + designation.replace('-', ' ').slice(1)}</Badge>
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const uniqueDepartments = Array.from(new Set(teachers.map(t => t.department))).filter(Boolean)
  const uniqueDesignations = Array.from(new Set(teachers.map(t => t.designation))).filter(Boolean)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage teaching staff and their professional information
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
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Create a new teacher record with their personal and professional information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="teacher@school.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId || ''}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      placeholder="TCH001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1-234-567-8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender || 'male'} onValueChange={(value) => setFormData({...formData, gender: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="Mathematics, Science, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Select value={formData.designation || 'teacher'} onValueChange={(value) => setFormData({...formData, designation: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="senior-teacher">Senior Teacher</SelectItem>
                        <SelectItem value="head-teacher">Head Teacher</SelectItem>
                        <SelectItem value="vice-principal">Vice Principal</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={formData.qualification || ''}
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="M.Sc. Mathematics, B.Ed."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate || ''}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value) || 0})}
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName || ''}
                      onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      placeholder="+1-234-567-8900"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm()}}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher}>Add Teacher</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teachers.filter(t => t.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length)} yrs
            </div>
            <p className="text-xs text-muted-foreground">Average experience</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.filter(t => t.status === 'on-leave').length}</div>
            <p className="text-xs text-muted-foreground">Currently on leave</p>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teacher Directory</CardTitle>
              {(searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || designationFilter !== 'all') && (
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
                  {departmentFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Department: {departmentFilter}
                    </Badge>
                  )}
                  {designationFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Designation: {designationFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearchParams({ search: null, status: null, department: null, designation: null, sortBy: null, sortOrder: null })}
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
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => updateSearchParams({ search: e.target.value })}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => updateSearchParams({ status: value })}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
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
              <Select value={designationFilter} onValueChange={(value) => updateSearchParams({ designation: value })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Designations</SelectItem>
                  {uniqueDesignations.map(designation => (
                    <SelectItem key={designation} value={designation}>
                      {designation.replace('-', ' ').charAt(0).toUpperCase() + designation.replace('-', ' ').slice(1)}
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
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="employeeId-asc">Employee ID ↑</SelectItem>
                  <SelectItem value="employeeId-desc">Employee ID ↓</SelectItem>
                  <SelectItem value="department-asc">Department A-Z</SelectItem>
                  <SelectItem value="department-desc">Department Z-A</SelectItem>
                  <SelectItem value="experience-asc">Experience ↑</SelectItem>
                  <SelectItem value="experience-desc">Experience ↓</SelectItem>
                  <SelectItem value="joiningDate-asc">Oldest First</SelectItem>
                  <SelectItem value="joiningDate-desc">Newest First</SelectItem>
                  <SelectItem value="salary-asc">Salary ↑</SelectItem>
                  <SelectItem value="salary-desc">Salary ↓</SelectItem>
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
                      Name
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
                      const newOrder = sortBy === 'employeeId' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'employeeId', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Employee ID
                      {sortBy === 'employeeId' && (
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
                  <TableHead>Subjects</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'experience' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'experience', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Experience
                      {sortBy === 'experience' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {teacher.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.employeeId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.department}</div>
                        {teacher.classTeacher && (
                          <div className="text-sm text-muted-foreground">Class Teacher: {teacher.classTeacher}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {teacher.subjects.slice(0, 2).map((subject, index) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.experience} years</div>
                        <div className="text-sm text-muted-foreground">
                          Since {new Date(teacher.joiningDate).getFullYear()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getDesignationBadge(teacher.designation)}</TableCell>
                    <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setViewingTeacher(teacher)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Teacher Details</DialogTitle>
                            </DialogHeader>
                            {viewingTeacher && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        Personal Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewingTeacher.firstName} {viewingTeacher.lastName}</div>
                                        <div><strong>Email:</strong> {viewingTeacher.email}</div>
                                        <div><strong>Phone:</strong> {viewingTeacher.phone || 'N/A'}</div>
                                        <div><strong>Date of Birth:</strong> {viewingTeacher.dateOfBirth ? new Date(viewingTeacher.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Age:</strong> {viewingTeacher.dateOfBirth ? calculateAge(viewingTeacher.dateOfBirth) : 'N/A'}</div>
                                        <div><strong>Gender:</strong> {viewingTeacher.gender}</div>
                                        <div><strong>Blood Group:</strong> {viewingTeacher.bloodGroup || 'N/A'}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Address
                                      </h3>
                                      <div className="mt-2 text-sm">
                                        {viewingTeacher.address || 'N/A'}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Emergency Contact
                                      </h3>
                                      <div className="mt-2 space-y-1 text-sm">
                                        <div><strong>Name:</strong> {viewingTeacher.emergencyContactName || 'N/A'}</div>
                                        <div><strong>Phone:</strong> {viewingTeacher.emergencyContact || 'N/A'}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Professional Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Employee ID:</strong> {viewingTeacher.employeeId}</div>
                                        <div><strong>Department:</strong> {viewingTeacher.department}</div>
                                        <div><strong>Designation:</strong> {getDesignationBadge(viewingTeacher.designation)}</div>
                                        <div><strong>Qualification:</strong> {viewingTeacher.qualification}</div>
                                        <div><strong>Experience:</strong> {viewingTeacher.experience} years</div>
                                        <div><strong>Joining Date:</strong> {viewingTeacher.joiningDate ? new Date(viewingTeacher.joiningDate).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Status:</strong> {getStatusBadge(viewingTeacher.status)}</div>
                                        <div><strong>Salary:</strong> ${viewingTeacher.salary.toLocaleString()}</div>
                                        {viewingTeacher.classTeacher && (
                                          <div><strong>Class Teacher:</strong> {viewingTeacher.classTeacher}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Subjects Teaching
                                      </h3>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {viewingTeacher.subjects.map((subject, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {subject}
                                          </Badge>
                                        ))}
                                        {viewingTeacher.subjects.length === 0 && (
                                          <span className="text-sm text-muted-foreground">No subjects assigned</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editingTeacher?.id === teacher.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingTeacher(null)
                            resetForm()
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(teacher)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Teacher</DialogTitle>
                              <DialogDescription>
                                Update teacher information and professional details.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-firstName">First Name *</Label>
                                  <Input
                                    id="edit-firstName"
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-lastName">Last Name *</Label>
                                  <Input
                                    id="edit-lastName"
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-department">Department</Label>
                                  <Input
                                    id="edit-department"
                                    value={formData.department || ''}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-designation">Designation</Label>
                                  <Select value={formData.designation || 'teacher'} onValueChange={(value) => setFormData({...formData, designation: value as any})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="teacher">Teacher</SelectItem>
                                      <SelectItem value="senior-teacher">Senior Teacher</SelectItem>
                                      <SelectItem value="head-teacher">Head Teacher</SelectItem>
                                      <SelectItem value="vice-principal">Vice Principal</SelectItem>
                                      <SelectItem value="principal">Principal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-experience">Experience (Years)</Label>
                                  <Input
                                    id="edit-experience"
                                    type="number"
                                    value={formData.experience || ''}
                                    onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
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
                                      <SelectItem value="on-leave">On Leave</SelectItem>
                                      <SelectItem value="retired">Retired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {setEditingTeacher(null); resetForm()}}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditTeacher}>Update Teacher</Button>
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
                              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {teacher.firstName} {teacher.lastName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteTeacher(teacher.id)}
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
          {paginatedTeachers.length === 0 && (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No teachers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first teacher.'}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredTeachers.length)} of {filteredTeachers.length} teachers
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