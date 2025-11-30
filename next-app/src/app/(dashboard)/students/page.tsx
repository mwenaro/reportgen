'use client'

import React from 'react'
import { Plus, Download, Upload, Filter, Search } from 'lucide-react'
import { 
  Button, 
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  LoadingTable,
  useNotify,
  Modal,
  useModal,
  Badge
} from '@/components'
import { useStudents, useDeleteStudent, useBulkDeleteStudents } from '@/lib/store/students'
import { Student, StudentFilters } from '@/lib/types'
import { StudentForm } from '@/components/students/student-form'
import { StudentImport } from '@/components/students/student-import'
import { StudentFiltersPanel } from '@/components/students/student-filters'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function StudentsPage() {
  const notify = useNotify()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filters, setFilters] = React.useState<StudentFilters>({})
  const [selectedStudents, setSelectedStudents] = React.useState<Student[]>([])
  
  const addStudentModal = useModal()
  const importStudentModal = useModal()
  const filtersModal = useModal()
  
  // Data hooks
  const { 
    data: students = [], 
    isLoading, 
    error,
    refetch 
  } = useStudents({ search: searchQuery, ...filters })
  
  const deleteStudent = useDeleteStudent()
  const bulkDeleteStudents = useBulkDeleteStudents()

  // Student table columns
  const columns = [
    {
      id: 'admissionNumber',
      header: 'Admission No.',
      accessorKey: 'admissionNumber' as keyof Student,
      sortable: true,
      filterable: true,
    },
    {
      id: 'name',
      header: 'Full Name',
      accessorKey: 'name' as keyof Student,
      sortable: true,
      filterable: true,
      cell: (student: Student) => (
        <div className="flex items-center gap-3">
          {student.profileImage ? (
            <img 
              src={student.profileImage} 
              alt={student.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">{student.name}</div>
            {student.email && (
              <div className="text-sm text-muted-foreground">{student.email}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'class',
      header: 'Class',
      accessorKey: 'className' as keyof Student,
      sortable: true,
      filterable: true,
      cell: (student: Student) => (
        <Badge variant="outline">{student.className || 'Not Assigned'}</Badge>
      ),
    },
    {
      id: 'gender',
      header: 'Gender',
      accessorKey: 'gender' as keyof Student,
      sortable: true,
      filterable: true,
      cell: (student: Student) => (
        <span className="capitalize">{student.gender}</span>
      ),
    },
    {
      id: 'enrollmentDate',
      header: 'Enrollment',
      accessorKey: 'enrollmentDate' as keyof Student,
      sortable: true,
      cell: (student: Student) => formatDate(student.enrollmentDate),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status' as keyof Student,
      sortable: true,
      filterable: true,
      cell: (student: Student) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          graduated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          transferred: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        }
        return (
          <Badge 
            variant="secondary" 
            className={statusColors[student.status] || statusColors.inactive}
          >
            {student.status}
          </Badge>
        )
      },
    },
    {
      id: 'guardian',
      header: 'Guardian',
      cell: (student: Student) => (
        <div>
          <div className="font-medium">{student.guardian?.name || 'N/A'}</div>
          {student.guardian?.phone && (
            <div className="text-sm text-muted-foreground">{student.guardian.phone}</div>
          )}
        </div>
      ),
    }
  ]

  // Table actions
  const actions = [
    {
      label: 'View Profile',
      onClick: (student: Student) => {
        window.location.href = `/students/${student.id}`
      },
    },
    {
      label: 'Edit',
      onClick: (student: Student) => {
        window.location.href = `/students/${student.id}/edit`
      },
    },
    {
      label: 'Delete',
      onClick: async (student: Student) => {
        if (confirm(`Are you sure you want to delete ${student.name}?`)) {
          try {
            await deleteStudent.mutateAsync(student.id)
            notify.success('Student deleted successfully')
            refetch()
          } catch (error) {
            notify.error('Failed to delete student')
          }
        }
      },
      variant: 'destructive' as const,
    },
  ]

  // Bulk actions
  const bulkActions = [
    {
      label: 'Delete Selected',
      onClick: async (students: Student[]) => {
        if (confirm(`Are you sure you want to delete ${students.length} students?`)) {
          try {
            await bulkDeleteStudents.mutateAsync(students.map(s => s.id))
            notify.success(`${students.length} students deleted successfully`)
            setSelectedStudents([])
            refetch()
          } catch (error) {
            notify.error('Failed to delete students')
          }
        }
      },
      variant: 'destructive' as const,
    }
  ]

  // Export students data
  const handleExport = async () => {
    try {
      const dataToExport = students.map(student => ({
        'Admission Number': student.admissionNumber,
        'Full Name': student.name,
        'Email': student.email || '',
        'Phone': student.phone || '',
        'Gender': student.gender,
        'Date of Birth': formatDate(student.dateOfBirth),
        'Class': student.className || '',
        'Guardian Name': student.guardian?.name || '',
        'Guardian Phone': student.guardian?.phone || '',
        'Guardian Email': student.guardian?.email || '',
        'Address': `${student.address?.street || ''}, ${student.address?.city || ''}`,
        'Enrollment Date': formatDate(student.enrollmentDate),
        'Status': student.status,
        'KCPE Marks': student.kcpeMarks || '',
      }))
      
      // Convert to CSV
      const headers = Object.keys(dataToExport[0] || {})
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row => 
          headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
        )
      ].join('\n')
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `students-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      notify.success('Students data exported successfully')
    } catch (error) {
      notify.error('Failed to export students data')
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Failed to load students: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage student profiles, admissions, and academic records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={importStudentModal.open}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={addStudentModal.open}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xs">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xs">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Male Students</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.gender === 'male').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xs">👨</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Female Students</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.gender === 'female').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <span className="text-pink-600 dark:text-pink-400 text-xs">👩</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, admission number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={filtersModal.open}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.keys(filters).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      {isLoading ? (
        <LoadingTable rows={10} columns={7} />
      ) : (
        <DataTable
          data={students}
          columns={columns}
          actions={actions}
          bulkActions={bulkActions}
          searchable={false} // We handle search externally
          emptyMessage="No students found. Add your first student to get started."
          className="bg-background"
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={addStudentModal.isOpen}
        onClose={addStudentModal.close}
        title="Add New Student"
        size="lg"
      >
        <StudentForm
          onSuccess={() => {
            addStudentModal.close()
            refetch()
            notify.success('Student added successfully')
          }}
          onCancel={addStudentModal.close}
        />
      </Modal>

      <Modal
        isOpen={importStudentModal.isOpen}
        onClose={importStudentModal.close}
        title="Import Students"
        size="lg"
      >
        <StudentImport
          onSuccess={(count) => {
            importStudentModal.close()
            refetch()
            notify.success(`${count} students imported successfully`)
          }}
          onCancel={importStudentModal.close}
        />
      </Modal>

      <Modal
        isOpen={filtersModal.isOpen}
        onClose={filtersModal.close}
        title="Filter Students"
        size="md"
      >
        <StudentFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={filtersModal.close}
        />
      </Modal>
    </div>
  )
}