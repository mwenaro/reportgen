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
  DataTable,
  LoadingSpinner,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components'
import { TeacherFiltersPanel } from '@/components/teachers/teacher-filters'
import { useTeachers, useDeleteTeacher } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { Teacher, TeacherFilters } from '@/lib/types'
import { exportToCSV, formatDate, formatPhoneNumber } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react'

export default function TeachersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filters, setFilters] = React.useState<TeacherFilters>({})
  const [showFilters, setShowFilters] = React.useState(false)
  const [selectedTeachers, setSelectedTeachers] = React.useState<string[]>([])

  const { data: teachers = [], isLoading, error } = useTeachers(filters)
  const { data: subjects = [] } = useSubjects()
  const deleteTeacher = useDeleteTeacher()

  // Filter teachers based on search term
  const filteredTeachers = React.useMemo(() => {
    if (!searchTerm) return teachers
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects?.some(subjectId => 
        subjects.find(s => s.id === subjectId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [teachers, searchTerm, subjects])

  // Calculate statistics
  const stats = React.useMemo(() => {
    const activeTeachers = teachers.filter(t => t.status === 'active')
    const totalSubjects = [...new Set(teachers.flatMap(t => t.subjects || []))].length
    const avgClasses = teachers.length > 0 
      ? teachers.reduce((sum, t) => sum + (t.classes?.length || 0), 0) / teachers.length 
      : 0

    return {
      total: teachers.length,
      active: activeTeachers.length,
      subjects: totalSubjects,
      avgClasses: Math.round(avgClasses * 10) / 10
    }
  }, [teachers])

  // Define table columns
  const columns: ColumnDef<Teacher>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected()
            if (e.target.checked) {
              setSelectedTeachers(table.getRowModel().rows.map(row => row.original.id))
            } else {
              setSelectedTeachers([])
            }
          }}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected()
            const teacherId = row.original.id
            setSelectedTeachers(prev => 
              e.target.checked 
                ? [...prev, teacherId]
                : prev.filter(id => id !== teacherId)
            )
          }}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'employeeId',
      header: 'Employee ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('employeeId')}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div className="flex items-center space-x-3">
            <div className="shrink-0 h-8 w-8">
              {teacher.profileImage ? (
                <img 
                  className="h-8 w-8 rounded-full object-cover" 
                  src={teacher.profileImage} 
                  alt={teacher.name}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{teacher.name}</div>
              <div className="text-sm text-gray-500">{teacher.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => {
        const teacherSubjects = row.original.subjects || []
        const subjectNames = teacherSubjects
          .map(subjectId => subjects.find(s => s.id === subjectId)?.name)
          .filter(Boolean)
        
        return (
          <div className="flex flex-wrap gap-1">
            {subjectNames.slice(0, 2).map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {subjectNames.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{subjectNames.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'classes',
      header: 'Classes',
      cell: ({ row }) => {
        const classCount = row.original.classes?.length || 0
        return (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            <span>{classCount}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge 
            variant={status === 'active' ? 'default' : status === 'inactive' ? 'secondary' : 'outline'}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'hireDate',
      header: 'Hire Date',
      cell: ({ row }) => formatDate(row.getValue('hireDate')),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/teachers/${teacher.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTeacher(teacher.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher.mutateAsync(teacherId)
      } catch (error) {
        console.error('Failed to delete teacher:', error)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTeachers.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedTeachers.length} teachers?`)) {
      try {
        await Promise.all(
          selectedTeachers.map(id => deleteTeacher.mutateAsync(id))
        )
        setSelectedTeachers([])
      } catch (error) {
        console.error('Failed to delete teachers:', error)
      }
    }
  }

  const handleExport = () => {
    const exportData = filteredTeachers.map(teacher => ({
      'Employee ID': teacher.employeeId,
      'Name': teacher.name,
      'Email': teacher.email || '',
      'Phone': teacher.phone || '',
      'Gender': teacher.gender,
      'Date of Birth': formatDate(teacher.dateOfBirth),
      'Hire Date': formatDate(teacher.hireDate),
      'Status': teacher.status,
      'Subjects': teacher.subjects?.map(subjectId => 
        subjects.find(s => s.id === subjectId)?.name
      ).join(', ') || '',
      'Classes': teacher.classes?.length || 0,
      'Qualification': teacher.qualification || '',
      'Experience': teacher.experience || '',
    }))

    exportToCSV(exportData, `teachers-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Error loading teachers: {error.message}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teaching staff and their assignments
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/teachers/import')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => router.push('/dashboard/teachers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjects Taught</p>
                <p className="text-3xl font-bold">{stats.subjects}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Classes</p>
                <p className="text-3xl font-bold">{stats.avgClasses}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Teachers List</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedTeachers.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedTeachers.length})
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teachers by name, email, employee ID, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {showFilters && (
            <div className="mb-4">
              <TeacherFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                subjects={subjects}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTeachers}
              searchKey="name"
              onRowClick={(teacher) => router.push(`/dashboard/teachers/${teacher.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}