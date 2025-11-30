'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  LoadingSpinner
} from '@/components'
import { useTeacher, useDeleteTeacher } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { useClasses } from '@/lib/store/classes'
import { formatDate, formatPhoneNumber, calculateAge } from '@/lib/utils'
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
  BookOpen,
  Award,
  FileText
} from 'lucide-react'

export default function TeacherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params.id as string

  const { data: teacher, isLoading, error } = useTeacher(teacherId)
  const { data: subjects = [] } = useSubjects()
  const { data: classes = [] } = useClasses()
  const deleteTeacher = useDeleteTeacher()

  const handleEdit = () => {
    router.push(`/teachers/${teacherId}/edit`)
  }

  const handleDelete = async () => {
    if (!teacher) return
    
    if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      try {
        await deleteTeacher.mutateAsync(teacherId)
        router.push('/teachers')
      } catch (error) {
        console.error('Failed to delete teacher:', error)
      }
    }
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

  if (error || !teacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">Teacher not found</p>
              <Button onClick={() => router.push('/teachers')} className="mt-4">
                Back to Teachers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get teacher's subjects
  const teacherSubjects = teacher.subjects?.map(subjectId => 
    subjects.find(s => s.id === subjectId)
  ).filter(Boolean) || []

  // Get teacher's classes
  const teacherClasses = teacher.classes?.map(classId => 
    classes.find(c => c.id === classId)
  ).filter(Boolean) || []

  const age = calculateAge(teacher.dateOfBirth)

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={teacher.status === 'active' ? 'default' : teacher.status === 'inactive' ? 'secondary' : 'outline'}
              >
                {teacher.status}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{teacher.employeeId}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {teacher.profileImage ? (
                  <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                      {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{teacher.name}</h3>
                  <p className="text-muted-foreground">Employee ID: {teacher.employeeId}</p>
                  {teacher.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-1" />
                      {teacher.email}
                    </div>
                  )}
                  {teacher.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-1" />
                      {formatPhoneNumber(teacher.phone)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                  <p className="capitalize">{teacher.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                  <p>{age} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                  <p>{formatDate(teacher.dateOfBirth)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID Number</Label>
                  <p>{teacher.idNumber || 'Not provided'}</p>
                </div>
                {teacher.address && (
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Address
                    </Label>
                    <p>{teacher.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Qualification</Label>
                  <p>{teacher.qualification || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Experience</Label>
                  <p>{teacher.experience || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Specialization</Label>
                  <p>{teacher.specialization || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">TSC Number</Label>
                  <p>{teacher.tscNumber || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Hire Date</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p>{formatDate(teacher.hireDate)}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contract Type</Label>
                  <Badge variant="outline" className="capitalize">
                    {teacher.contractType}
                  </Badge>
                </div>
              </div>

              {teacher.salary && (
                <div className="pt-4 border-t mt-4">
                  <Label className="text-sm font-medium text-muted-foreground">Monthly Salary</Label>
                  <p className="text-lg font-semibold">KSh {teacher.salary.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {teacher.emergencyContact && (teacher.emergencyContact.name || teacher.emergencyContact.phone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teacher.emergencyContact.name && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                      <p>{teacher.emergencyContact.name}</p>
                    </div>
                  )}
                  {teacher.emergencyContact.phone && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p>{formatPhoneNumber(teacher.emergencyContact.phone)}</p>
                    </div>
                  )}
                  {teacher.emergencyContact.relationship && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
                      <p className="capitalize">{teacher.emergencyContact.relationship}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {teacher.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{teacher.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Subjects ({teacherSubjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacherSubjects.length > 0 ? (
                <div className="space-y-2">
                  {teacherSubjects.map((subject) => (
                    <div key={subject!.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div>
                        <p className="font-medium">{subject!.name}</p>
                        <p className="text-sm text-muted-foreground">{subject!.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No subjects assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Classes ({teacherClasses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacherClasses.length > 0 ? (
                <div className="space-y-2">
                  {teacherClasses.map((classItem) => (
                    <div key={classItem!.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div>
                        <p className="font-medium">{classItem!.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {classItem!.currentEnrollment} / {classItem!.capacity} students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No classes assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Subjects</span>
                <Badge variant="secondary">{teacherSubjects.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Classes</span>
                <Badge variant="secondary">{teacherClasses.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Years of Service</span>
                <Badge variant="secondary">
                  {Math.floor((Date.now() - teacher.hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper component for labels
function Label({ children, className = '', ...props }: { children: React.ReactNode, className?: string }) {
  return (
    <label className={`block text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  )
}