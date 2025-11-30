'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Users,
  FileText,
  Camera,
  MoreVertical
} from 'lucide-react'
import { 
  Button, 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LoadingSpinner,
  useNotify,
  ConfirmModal,
  useConfirmModal
} from '@/components'
import { useStudent, useDeleteStudent } from '@/lib/store/students'
import { useStudentGrades } from '@/lib/store/grades'
import { formatDate, formatAge, formatCurrency, cn } from '@/lib/utils'

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const notify = useNotify()
  const { confirm, ConfirmModal: ConfirmModalComponent } = useConfirmModal()
  
  const studentId = params.id as string
  const { data: student, isLoading, error } = useStudent(studentId)
  const { data: grades = [] } = useStudentGrades(studentId)
  const deleteStudent = useDeleteStudent()

  const handleEdit = () => {
    router.push(`/students/${studentId}/edit`)
  }

  const handleDelete = () => {
    confirm({
      title: 'Delete Student',
      description: `Are you sure you want to delete ${student?.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteStudent.mutateAsync(studentId)
          notify.success('Student deleted successfully')
          router.push('/students')
        } catch (error) {
          notify.error('Failed to delete student')
        }
      }
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Student not found or failed to load</p>
              <Button onClick={() => router.push('/students')} className="mt-4">
                Back to Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const age = formatAge(student.dateOfBirth)
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    graduated: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    transferred: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/students')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Profile</h1>
            <p className="text-muted-foreground">
              View and manage student information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Print Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Basic Information</CardTitle>
                <Badge 
                  variant="secondary" 
                  className={statusColors[student.status] || statusColors.inactive}
                >
                  {student.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={student.profileImage} alt={student.name} />
                    <AvatarFallback className="text-lg">
                      {student.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-7 w-7 p-0"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-semibold">{student.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Admission Number</label>
                      <p className="text-lg font-semibold">{student.admissionNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="capitalize">{student.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Age</label>
                      <p>{age} years old</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p>{formatDate(student.dateOfBirth)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Enrollment Date</label>
                      <p>{formatDate(student.enrollmentDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{student.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{student.phone || 'Not provided'}</p>
                  </div>
                </div>
                {student.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{student.address.street}</p>
                        <p>{student.address.city}, {student.address.county}</p>
                        {student.address.postalCode && <p>{student.address.postalCode}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Guardian Name</label>
                  <p className="font-medium">{student.guardian?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                  <p className="capitalize">{student.guardian?.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{student.guardian?.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{student.guardian?.email || 'Not provided'}</p>
                  </div>
                </div>
                {student.guardian?.occupation && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                    <p>{student.guardian.occupation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grades.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Subject</th>
                          <th className="text-center py-2">Grade</th>
                          <th className="text-center py-2">Mark</th>
                          <th className="text-left py-2">Term</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((grade, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{grade.subjectName}</td>
                            <td className="text-center py-2">
                              <Badge variant="outline">{grade.grade}</Badge>
                            </td>
                            <td className="text-center py-2">{grade.mark}</td>
                            <td className="py-2">{grade.term}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No academic records yet</p>
                    <p className="text-sm">Grades will appear here once entered</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Academic Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Class</label>
                <p className="text-lg font-semibold">{student.className || 'Not Assigned'}</p>
              </div>
              {student.kcpeMarks && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">KCPE Marks</label>
                  <p className="text-lg font-semibold">{student.kcpeMarks} / 500</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                <p>2024</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <GraduationCap className="h-4 w-4 mr-2" />
                View Grades
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Attendance Record
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contact Guardian
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(student.medicalInfo || student.notes) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.medicalInfo && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medical Information</label>
                    <p className="text-sm mt-1 p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                      {student.medicalInfo}
                    </p>
                  </div>
                )}
                {student.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="text-sm mt-1">{student.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmModalComponent />
    </div>
  )
}