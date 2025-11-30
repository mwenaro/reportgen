'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  LoadingSpinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTransition,
  Progress
} from '@/components'
import { useSubject, useDeleteSubject } from '@/lib/store/subjects'
import { useClasses } from '@/lib/store/classes'
import { useTeachers } from '@/lib/store/teachers'
import { formatDate } from '@/lib/utils'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  BookOpen, 
  Award,
  Users, 
  Building,
  GraduationCap,
  Calendar,
  BarChart3,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default function SubjectDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: subject, isLoading, error } = useSubject(id)
  const { data: classes = [] } = useClasses()
  const { data: teachers = [] } = useTeachers()
  const deleteSubject = useDeleteSubject()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">
                {error?.message || 'Subject not found'}
              </p>
              <Button onClick={() => router.back()} className="mt-4">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      try {
        await deleteSubject.mutateAsync(id)
        router.push('/dashboard/subjects')
        router.refresh()
      } catch (error) {
        console.error('Failed to delete subject:', error)
      }
    }
  }

  // Find related classes and teachers
  const relatedClasses = classes.filter(cls => 
    cls.subjects?.includes(id)
  )

  const relatedTeachers = teachers.filter(teacher => 
    teacher.subjects?.includes(id)
  )

  // Mock statistics
  const stats = {
    classesCount: relatedClasses.length,
    teachersCount: relatedTeachers.length,
    totalStudents: relatedClasses.reduce((sum, cls) => sum + cls.currentEnrollment, 0),
    avgClassSize: relatedClasses.length > 0 
      ? Math.round(relatedClasses.reduce((sum, cls) => sum + cls.currentEnrollment, 0) / relatedClasses.length)
      : 0,
    performance: Math.floor(Math.random() * 30) + 70, // Mock performance data
    completion: Math.floor(Math.random() * 20) + 80   // Mock completion rate
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                {subject.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {subject.code} • {subject.department || 'No Department'} • {subject.credits} Credits
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/subjects/${id}/edit`)}
          >
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">{stats.classesCount}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold">{stats.teachersCount}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">{stats.performance}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTransition value="overview">Overview</TabsTransition>
          <TabsTransition value="classes">Classes</TabsTransition>
          <TabsTransition value="teachers">Teachers</TabsTransition>
          <TabsTransition value="analytics">Analytics</TabsTransition>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Subject Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Code</p>
                    <p className="font-medium">{subject.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Credits</p>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p className="font-medium">{subject.credits}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="font-medium">{subject.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Level</p>
                    <p className="font-medium">{subject.level || 'All levels'}</p>
                  </div>
                </div>

                {subject.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{subject.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Created</p>
                  <p className="text-sm">{formatDate(subject.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Class Coverage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(stats.classesCount / Math.max(classes.length, 1)) * 100} className="w-20" />
                      <span className="text-sm font-medium">{stats.classesCount}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teacher Assignment</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(stats.teachersCount / Math.max(teachers.length, 1)) * 100} className="w-20" />
                      <span className="text-sm font-medium">{stats.teachersCount}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={stats.performance} className="w-20" />
                      <span className="text-sm font-medium">{stats.performance}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={stats.completion} className="w-20" />
                      <span className="text-sm font-medium">{stats.completion}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subject.department ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Department</span>
                      <Badge variant="outline">{subject.department}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Academic Level</span>
                      <Badge variant="secondary">{subject.level || 'All Levels'}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5" />
                    <p>No department assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-xl font-bold text-primary">{subject.credits}</div>
                    <div className="text-xs text-muted-foreground">Credit Hours</div>
                  </div>

                  <div className="text-center p-3 bg-secondary/5 rounded-lg">
                    <div className="text-xl font-bold text-secondary-foreground">{stats.avgClassSize}</div>
                    <div className="text-xs text-muted-foreground">Avg Class Size</div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Updated:</span>
                    <span className="font-medium">{formatDate(subject.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes Using This Subject ({relatedClasses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedClasses.length > 0 ? (
                <div className="space-y-4">
                  {relatedClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/classes/${classItem.id}`)}
                    >
                      <div>
                        <h3 className="font-medium">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {classItem.level} - {classItem.section} • {classItem.academicYear}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {classItem.currentEnrollment} students
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Teacher: {classItem.classTeacherName || 'Not assigned'}
                          </div>
                        </div>
                        <Badge variant={classItem.isActive ? 'default' : 'secondary'}>
                          {classItem.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No classes are currently using this subject</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers for This Subject ({relatedTeachers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedTeachers.length > 0 ? (
                <div className="space-y-4">
                  {relatedTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/teachers/${teacher.id}`)}
                    >
                      <div>
                        <h3 className="font-medium">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {teacher.qualification || 'No qualification specified'} • {teacher.experience || 'No experience specified'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                          {teacher.status}
                        </Badge>
                        <Badge variant="outline">
                          {teacher.contractType || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No teachers are assigned to this subject</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Classes Using Subject</span>
                      <span className="text-sm font-medium">{stats.classesCount}/{classes.length}</span>
                    </div>
                    <Progress value={(stats.classesCount / Math.max(classes.length, 1)) * 100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Teacher Assignment</span>
                      <span className="text-sm font-medium">{stats.teachersCount}/{teachers.length}</span>
                    </div>
                    <Progress value={(stats.teachersCount / Math.max(teachers.length, 1)) * 100} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Student Enrollment</span>
                      <span className="text-sm font-medium">{stats.totalStudents}</span>
                    </div>
                    <Progress value={Math.min((stats.totalStudents / 100), 1) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Average Performance</span>
                      <span className="text-sm font-medium">{stats.performance}%</span>
                    </div>
                    <Progress value={stats.performance} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">{stats.completion}%</span>
                    </div>
                    <Progress value={stats.completion} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Subject Utilization</span>
                      <span className="text-sm font-medium">
                        {Math.round(((stats.classesCount + stats.teachersCount) / 2 / Math.max(classes.length, teachers.length, 1)) * 100)}%
                      </span>
                    </div>
                    <Progress value={((stats.classesCount + stats.teachersCount) / 2 / Math.max(classes.length, teachers.length, 1)) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}