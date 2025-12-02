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
  ChevronRight
} from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  class: string
  section: string
  rollNumber: string
  admissionDate: string
  status: 'active' | 'inactive' | 'graduated' | 'transferred'
  bloodGroup?: string
  emergencyContact?: string
  createdAt: string
  updatedAt: string
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-234-567-8901',
    dateOfBirth: '2006-05-15',
    gender: 'male',
    address: '123 Main St, Springfield, IL 62701',
    guardianName: 'Robert Doe',
    guardianPhone: '+1-234-567-8900',
    guardianEmail: 'robert.doe@email.com',
    class: 'Grade 12',
    section: 'A',
    rollNumber: '12001',
    admissionDate: '2023-08-01',
    status: 'active',
    bloodGroup: 'O+',
    emergencyContact: '+1-234-567-8900',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2023-08-01T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1-234-567-8902',
    dateOfBirth: '2006-03-20',
    gender: 'female',
    address: '456 Oak Ave, Springfield, IL 62702',
    guardianName: 'Mary Smith',
    guardianPhone: '+1-234-567-8903',
    guardianEmail: 'mary.smith@email.com',
    class: 'Grade 11',
    section: 'B',
    rollNumber: '11025',
    admissionDate: '2023-08-01',
    status: 'active',
    bloodGroup: 'A+',
    emergencyContact: '+1-234-567-8903',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2023-08-01T10:00:00Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@email.com',
    phone: '+1-234-567-8904',
    dateOfBirth: '2007-01-10',
    gender: 'male',
    address: '789 Pine St, Springfield, IL 62703',
    guardianName: 'David Johnson',
    guardianPhone: '+1-234-567-8905',
    guardianEmail: 'david.johnson@email.com',
    class: 'Grade 10',
    section: 'A',
    rollNumber: '10015',
    admissionDate: '2023-08-01',
    status: 'active',
    bloodGroup: 'B+',
    emergencyContact: '+1-234-567-8905',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2023-08-01T10:00:00Z'
  }
]

export default function StudentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const searchTerm = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const classFilter = searchParams.get('class') || 'all'
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = searchParams.get('sortOrder') || 'asc'
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(mockStudents)
  const [paginatedStudents, setPaginatedStudents] = useState<Student[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Partial<Student>>({
    status: 'active',
    gender: 'male'
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
    router.replace(`/dashboard/students${query}`, { scroll: false })
  }

  // Filter and sort students based on URL parameters
  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.includes(searchTerm) ||
        student.phone.includes(searchTerm)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter)
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter(student => student.class === classFilter)
    }

    // Sort students
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'rollNumber':
          aValue = a.rollNumber
          bValue = b.rollNumber
          break
        case 'class':
          aValue = a.class.toLowerCase()
          bValue = b.class.toLowerCase()
          break
        case 'admissionDate':
          aValue = new Date(a.admissionDate).getTime()
          bValue = new Date(b.admissionDate).getTime()
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

    setFilteredStudents(filtered)
    
    // Calculate pagination
    const total = filtered.length
    const totalPagesCalc = Math.ceil(total / pageSize)
    setTotalPages(totalPagesCalc)
    
    // Get paginated results
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginated = filtered.slice(startIndex, endIndex)
    setPaginatedStudents(paginated)
    
  }, [students, searchTerm, statusFilter, classFilter, sortBy, sortOrder, page, pageSize])

  const handleAddStudent = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender as 'male' | 'female' | 'other',
      address: formData.address || '',
      guardianName: formData.guardianName || '',
      guardianPhone: formData.guardianPhone || '',
      guardianEmail: formData.guardianEmail || '',
      class: formData.class || '',
      section: formData.section || '',
      rollNumber: formData.rollNumber || '',
      admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
      status: formData.status as 'active' | 'inactive' | 'graduated' | 'transferred',
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setStudents([...students, newStudent])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditStudent = () => {
    if (!editingStudent || !formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    const updatedStudent = {
      ...editingStudent,
      ...formData,
      updatedAt: new Date().toISOString()
    } as Student

    setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s))
    setEditingStudent(null)
    resetForm()
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId))
  }

  const resetForm = () => {
    setFormData({
      status: 'active',
      gender: 'male'
    })
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    setFormData(student)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      active: 'default',
      inactive: 'secondary',
      graduated: 'outline',
      transferred: 'destructive'
    }
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
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

  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).filter(Boolean)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage student registrations and information
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
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Create a new student record with their personal and academic information.
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
                      placeholder="student@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1-234-567-8900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup || ''}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      placeholder="O+, A-, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input
                      id="class"
                      value={formData.class || ''}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      placeholder="Grade 12, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      value={formData.section || ''}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      placeholder="A, B, C, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      value={formData.rollNumber || ''}
                      onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                      placeholder="12001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName || ''}
                      onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                      placeholder="Parent/Guardian name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone || ''}
                      onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                      placeholder="+1-234-567-8900"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm()}}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>Add Student</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              {students.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.status === 'graduated').length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueClasses.length}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Directory</CardTitle>
              {(searchTerm || statusFilter !== 'all' || classFilter !== 'all') && (
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
                  {classFilter !== 'all' && (
                    <Badge variant="secondary" className="text-xs">
                      Class: {classFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSearchParams({ search: null, status: null, class: null, sortBy: null, sortOrder: null })}
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
                  placeholder="Search students..."
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
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={(value) => updateSearchParams({ class: value })}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
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
                  <SelectItem value="rollNumber-asc">Roll Number ↑</SelectItem>
                  <SelectItem value="rollNumber-desc">Roll Number ↓</SelectItem>
                  <SelectItem value="class-asc">Class A-Z</SelectItem>
                  <SelectItem value="class-desc">Class Z-A</SelectItem>
                  <SelectItem value="admissionDate-asc">Oldest First</SelectItem>
                  <SelectItem value="admissionDate-desc">Newest First</SelectItem>
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
                      const newOrder = sortBy === 'rollNumber' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'rollNumber', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Roll Number
                      {sortBy === 'rollNumber' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => {
                      const newOrder = sortBy === 'class' && sortOrder === 'asc' ? 'desc' : 'asc'
                      updateSearchParams({ sortBy: 'class', sortOrder: newOrder })
                    }}
                  >
                    <div className="flex items-center">
                      Class
                      {sortBy === 'class' && (
                        <span className="ml-1 text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.class}</div>
                        <div className="text-sm text-muted-foreground">Section {student.section}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {student.phone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{student.guardianName || 'N/A'}</div>
                        <div className="text-muted-foreground">{student.guardianPhone || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setViewingStudent(student)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                            </DialogHeader>
                            {viewingStudent && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        Personal Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewingStudent.firstName} {viewingStudent.lastName}</div>
                                        <div><strong>Email:</strong> {viewingStudent.email}</div>
                                        <div><strong>Phone:</strong> {viewingStudent.phone || 'N/A'}</div>
                                        <div><strong>Date of Birth:</strong> {viewingStudent.dateOfBirth ? new Date(viewingStudent.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Age:</strong> {viewingStudent.dateOfBirth ? calculateAge(viewingStudent.dateOfBirth) : 'N/A'}</div>
                                        <div><strong>Gender:</strong> {viewingStudent.gender}</div>
                                        <div><strong>Blood Group:</strong> {viewingStudent.bloodGroup || 'N/A'}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Address
                                      </h3>
                                      <div className="mt-2 text-sm">
                                        {viewingStudent.address || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Academic Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Class:</strong> {viewingStudent.class}</div>
                                        <div><strong>Section:</strong> {viewingStudent.section}</div>
                                        <div><strong>Roll Number:</strong> {viewingStudent.rollNumber}</div>
                                        <div><strong>Admission Date:</strong> {viewingStudent.admissionDate ? new Date(viewingStudent.admissionDate).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Status:</strong> {getStatusBadge(viewingStudent.status)}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold flex items-center">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Guardian Information
                                      </h3>
                                      <div className="mt-2 space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewingStudent.guardianName || 'N/A'}</div>
                                        <div><strong>Phone:</strong> {viewingStudent.guardianPhone || 'N/A'}</div>
                                        <div><strong>Email:</strong> {viewingStudent.guardianEmail || 'N/A'}</div>
                                        <div><strong>Emergency Contact:</strong> {viewingStudent.emergencyContact || 'N/A'}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingStudent(null)
                            resetForm()
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(student)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Student</DialogTitle>
                              <DialogDescription>
                                Update student information and academic details.
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
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-class">Class</Label>
                                  <Input
                                    id="edit-class"
                                    value={formData.class || ''}
                                    onChange={(e) => setFormData({...formData, class: e.target.value})}
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
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="graduated">Graduated</SelectItem>
                                      <SelectItem value="transferred">Transferred</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {setEditingStudent(null); resetForm()}}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditStudent}>Update Student</Button>
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
                              <AlertDialogTitle>Delete Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {student.firstName} {student.lastName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteStudent(student.id)}
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
          {paginatedStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first student.'}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredStudents.length)} of {filteredStudents.length} students
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
                      // Show first page, last page, current page, and pages around current
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