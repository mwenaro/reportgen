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
  Badge
} from '@/components'
import { ClassFiltersPanel } from '@/components/classes/class-filters'
import { useClasses, useDeleteClass } from '@/lib/store/classes'
import { useTeachers } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { Class, ClassFilters } from '@/lib/types'
import { exportToCSV, formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Edit,
  Eye,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
  Calendar
} from 'lucide-react'

export default function ClassesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filters, setFilters] = React.useState<ClassFilters>({})
  const [showFilters, setShowFilters] = React.useState(false)
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>([])

  const { data: classes = [], isLoading, error } = useClasses(filters)
  const { data: teachers = [] } = useTeachers()
  const { data: subjects = [] } = useSubjects()
  const deleteClass = useDeleteClass()

  // Filter classes based on search term
  const filteredClasses = React.useMemo(() => {
    if (!searchTerm) return classes
    return classes.filter(classItem => 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.classTeacherName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [classes, searchTerm])

  // Calculate statistics
  const stats = React.useMemo(() => {
    const activeClasses = classes.filter(c => c.isActive)
    const totalStudents = classes.reduce((sum, c) => sum + c.currentEnrollment, 0)
    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0)
    const avgUtilization = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0

    return {
      total: classes.length,
      active: activeClasses.length,
      totalStudents,
      avgUtilization: Math.round(avgUtilization * 10) / 10
    }
  }, [classes])

  // Define table columns
  const columns: ColumnDef<Class>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected()
            if (e.target.checked) {
              setSelectedClasses(table.getRowModel().rows.map(row => row.original.id))
            } else {
              setSelectedClasses([])
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
            const classId = row.original.id
            setSelectedClasses(prev => 
              e.target.checked 
                ? [...prev, classId]
                : prev.filter(id => id !== classId)
            )
          }}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Class Name',
      cell: ({ row }) => {
        const classItem = row.original
        return (
          <div>
            <div className="font-medium">{classItem.name}</div>
            <div className="text-sm text-gray-500">
              {classItem.level} - {classItem.section}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'classTeacherName',
      header: 'Class Teacher',
      cell: ({ row }) => {
        const teacherName = row.original.classTeacherName
        return teacherName ? (
          <div className="font-medium">{teacherName}</div>
        ) : (
          <span className="text-gray-400">Not assigned</span>
        )
      },
    },
    {
      accessorKey: 'currentEnrollment',
      header: 'Enrollment',
      cell: ({ row }) => {
        const classItem = row.original
        const utilizationPercent = (classItem.currentEnrollment / classItem.capacity) * 100
        const isOverCapacity = classItem.currentEnrollment > classItem.capacity
        
        return (
          <div className="flex items-center space-x-2">
            <div>
              <span className={isOverCapacity ? 'text-red-600 font-medium' : ''}>
                {classItem.currentEnrollment} / {classItem.capacity}
              </span>
              <div className="text-xs text-gray-500">
                {utilizationPercent.toFixed(0)}% capacity
              </div>
            </div>
            {isOverCapacity && (
              <Badge variant="destructive" className="text-xs">
                Over capacity
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'subjects',
      header: 'Subjects',
      cell: ({ row }) => {
        const subjectCount = row.original.subjects?.length || 0
        return (
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
            <span>{subjectCount}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'academicYear',
      header: 'Academic Year',
      cell: ({ row }) => row.getValue('academicYear'),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const classItem = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/classes/${classItem.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/classes/${classItem.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClass(classItem.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleDeleteClass = async (classId: string) => {
    const classItem = classes.find(c => c.id === classId)
    if (confirm(`Are you sure you want to delete ${classItem?.name}?`)) {
      try {
        await deleteClass.mutateAsync(classId)
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedClasses.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedClasses.length} classes?`)) {
      try {
        await Promise.all(
          selectedClasses.map(id => deleteClass.mutateAsync(id))
        )
        setSelectedClasses([])
      } catch (error) {
        console.error('Failed to delete classes:', error)
      }
    }
  }

  const handleExport = () => {
    const exportData = filteredClasses.map(classItem => ({
      'Class Name': classItem.name,
      'Level': classItem.level,
      'Section': classItem.section,
      'Class Teacher': classItem.classTeacherName || '',
      'Current Enrollment': classItem.currentEnrollment,
      'Capacity': classItem.capacity,
      'Utilization %': Math.round((classItem.currentEnrollment / classItem.capacity) * 100),
      'Subjects': classItem.subjects?.length || 0,
      'Academic Year': classItem.academicYear,
      'Status': classItem.isActive ? 'Active' : 'Inactive',
      'Created At': formatDate(classItem.createdAt),
    }))

    exportToCSV(exportData, `classes-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Error loading classes: {error.message}</p>
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
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">
            Manage academic classes and student enrollment
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/classes/import')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => router.push('/dashboard/classes/new')}
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                <p className="text-3xl font-bold">{stats.avgUtilization}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Classes List</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedClasses.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedClasses.length})
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
                placeholder="Search classes by name, level, section, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {showFilters && (
            <div className="mb-4">
              <ClassFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                teachers={teachers}
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
              data={filteredClasses}
              searchKey="name"
              onRowClick={(classItem) => router.push(`/dashboard/classes/${classItem.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}