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
import { SubjectFiltersPanel } from '@/components/subjects/subject-filters'
import { useSubjects, useDeleteSubject } from '@/lib/store/subjects'
import { Subject, SubjectFilters } from '@/lib/types'
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
  BookOpen,
  Users,
  Award,
  Calendar
} from 'lucide-react'

export default function SubjectsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filters, setFilters] = React.useState<SubjectFilters>({})
  const [showFilters, setShowFilters] = React.useState(false)
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([])

  const { data: subjects = [], isLoading, error } = useSubjects(filters)
  const deleteSubject = useDeleteSubject()

  // Filter subjects based on search term
  const filteredSubjects = React.useMemo(() => {
    if (!searchTerm) return subjects
    return subjects.filter(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [subjects, searchTerm])

  // Calculate statistics
  const stats = React.useMemo(() => {
    const activeSubjects = subjects.filter(s => s.isActive)
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)
    const avgCredits = subjects.length > 0 ? totalCredits / subjects.length : 0

    return {
      total: subjects.length,
      active: activeSubjects.length,
      totalCredits,
      avgCredits: Math.round(avgCredits * 10) / 10
    }
  }, [subjects])

  // Define table columns
  const columns: ColumnDef<Subject>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected()
            if (e.target.checked) {
              setSelectedSubjects(table.getRowModel().rows.map(row => row.original.id))
            } else {
              setSelectedSubjects([])
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
            const subjectId = row.original.id
            setSelectedSubjects(prev => 
              e.target.checked 
                ? [...prev, subjectId]
                : prev.filter(id => id !== subjectId)
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
      header: 'Subject',
      cell: ({ row }) => {
        const subject = row.original
        return (
          <div>
            <div className="font-medium">{subject.name}</div>
            <div className="text-sm text-gray-500">
              Code: {subject.code}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => {
        const department = row.original.department
        return department ? (
          <Badge variant="outline">{department}</Badge>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )
      },
    },
    {
      accessorKey: 'credits',
      header: 'Credits',
      cell: ({ row }) => {
        const credits = row.original.credits
        return (
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-gray-400" />
            <span>{credits}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => {
        const level = row.original.level
        return level ? (
          <Badge variant="secondary">{level}</Badge>
        ) : (
          <span className="text-gray-400">All levels</span>
        )
      },
    },
    {
      accessorKey: 'teacherCount',
      header: 'Teachers',
      cell: ({ row }) => {
        const count = row.original.teacherCount || 0
        return (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            <span>{count}</span>
          </div>
        )
      },
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
        const subject = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/subjects/${subject.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/subjects/${subject.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSubject(subject.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleDeleteSubject = async (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId)
    if (confirm(`Are you sure you want to delete ${subject?.name}?`)) {
      try {
        await deleteSubject.mutateAsync(subjectId)
      } catch (error) {
        console.error('Failed to delete subject:', error)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSubjects.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedSubjects.length} subjects?`)) {
      try {
        await Promise.all(
          selectedSubjects.map(id => deleteSubject.mutateAsync(id))
        )
        setSelectedSubjects([])
      } catch (error) {
        console.error('Failed to delete subjects:', error)
      }
    }
  }

  const handleExport = () => {
    const exportData = filteredSubjects.map(subject => ({
      'Subject Name': subject.name,
      'Code': subject.code,
      'Department': subject.department || '',
      'Level': subject.level || '',
      'Credits': subject.credits,
      'Teachers': subject.teacherCount || 0,
      'Description': subject.description || '',
      'Status': subject.isActive ? 'Active' : 'Inactive',
      'Created At': formatDate(subject.createdAt),
    }))

    exportToCSV(exportData, `subjects-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Error loading subjects: {error.message}</p>
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
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Manage academic subjects and curriculum
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={() => router.push('/subjects/import')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => router.push('/subjects/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subjects</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
                <p className="text-3xl font-bold">{stats.totalCredits}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Credits</p>
                <p className="text-3xl font-bold">{stats.avgCredits}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Subjects List</CardTitle>
            <div className="flex items-center space-x-2">
              {selectedSubjects.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedSubjects.length})
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
                placeholder="Search subjects by name, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {showFilters && (
            <div className="mb-4">
              <SubjectFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
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
              data={filteredSubjects}
              searchKey="name"
              onRowClick={(subject) => router.push(`/subjects/${subject.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}