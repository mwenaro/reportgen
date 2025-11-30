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
  Avatar,
  AvatarFallback,
  LoadingSpinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTransition,
  Progress
} from '@/components'
import { useClass, useDeleteClass } from '@/lib/store/classes'
import { useStudents } from '@/lib/store/students'
import { useSubjects } from '@/lib/store/subjects'
import { formatDate, formatTime } from '@/lib/utils'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Users, 
  BookOpen, 
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  BarChart3
} from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default function ClassDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: classData, isLoading, error } = useClass(id)
  const { data: students = [] } = useStudents({ classId: id })
  const { data: subjects = [] } = useSubjects()
  const deleteClass = useDeleteClass()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600">
                {error?.message || 'Class not found'}
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
    if (confirm(`Are you sure you want to delete ${classData.name}?`)) {
      try {
        await deleteClass.mutateAsync(id)
        router.push('/classes')
        router.refresh()
      } catch (error) {
        console.error('Failed to delete class:', error)
      }
    }
  }

  const classStudents = students.filter(student => 
    student.classId === id && student.status === 'active'
  )

  const classSubjects = subjects.filter(subject => 
    classData.subjects?.includes(subject.id)
  )

  const utilizationPercent = (classData.currentEnrollment / classData.capacity) * 100
  const isOverCapacity = classData.currentEnrollment > classData.capacity

  // Calculate statistics
  const stats = {
    enrollmentRate: utilizationPercent,
    activeStudents: classStudents.length,
    subjectsCount: classSubjects.length,
    averageAge: classStudents.length > 0 
      ? Math.round(classStudents.reduce((sum, student) => {
          const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()
          return sum + age
        }, 0) / classStudents.length)
      : 0
  }

  const performanceData = {
    attendance: Math.floor(Math.random() * 20) + 80, // Mock data
    academicPerformance: Math.floor(Math.random() * 30) + 70,
    behaviorScore: Math.floor(Math.random() * 15) + 85
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
              <h1 className="text-3xl font-bold">{classData.name}</h1>
              <Badge variant={classData.isActive ? 'default' : 'secondary'}>
                {classData.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {classData.level} - {classData.section} • {classData.academicYear}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/classes/${id}/edit`)}
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
                <p className="text-sm font-medium text-muted-foreground">Enrollment</p>
                <p className="text-2xl font-bold">
                  {classData.currentEnrollment} / {classData.capacity}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={utilizationPercent} className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {utilizationPercent.toFixed(0)}%
                  </span>
                </div>
                {isOverCapacity && (
                  <p className="text-xs text-red-600 mt-1">Over capacity</p>
                )}
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
                <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">{stats.subjectsCount}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">{performanceData.attendance}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">{performanceData.academicPerformance}%</p>
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
          <TabsTransition value="students">Students</TabsTransition>
          <TabsTransition value="subjects">Subjects</TabsTransition>
          <TabsTransition value="schedule">Schedule</TabsTransition>
          <TabsTransition value="analytics">Analytics</TabsTransition>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Class Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Level</p>
                    <p className="font-medium">{classData.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Section</p>
                    <p className="font-medium">{classData.section}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
                    <p className="font-medium">{classData.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room</p>
                    <p className="font-medium">{classData.room || 'Not specified'}</p>
                  </div>
                </div>

                {classData.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{classData.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Created</p>
                  <p className="text-sm">{formatDate(classData.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Class Teacher */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Class Teacher
                </CardTitle>
              </CardHeader>
              <CardContent>
                {classData.classTeacherName ? (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {classData.classTeacherName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{classData.classTeacherName}</p>
                      <p className="text-sm text-muted-foreground">Class Teacher</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5" />
                    <p>No class teacher assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                    <p className="font-medium">{formatTime(classData.schedule?.startTime || '08:00')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Time</p>
                    <p className="font-medium">{formatTime(classData.schedule?.endTime || '15:00')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Days of Week</p>
                  <div className="flex flex-wrap gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                      <Badge 
                        key={day} 
                        variant={
                          classData.schedule?.daysOfWeek?.includes(day) 
                            ? 'default' 
                            : 'outline'
                        }
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </Badge>
                    ))}
                  </div>
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
                    <span className="text-sm">Enrollment Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={utilizationPercent} className="w-20" />
                      <span className="text-sm font-medium">{utilizationPercent.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attendance Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={performanceData.attendance} className="w-20" />
                      <span className="text-sm font-medium">{performanceData.attendance}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Performance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={performanceData.academicPerformance} className="w-20" />
                      <span className="text-sm font-medium">{performanceData.academicPerformance}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students ({classStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {classStudents.length > 0 ? (
                <div className="space-y-4">
                  {classStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/students/${student.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName[0]}{student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {student.studentId} • {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years old
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No students enrolled in this class yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects ({classSubjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {classSubjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/subjects/${subject.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Code: {subject.code}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {subject.credits} credits
                        </Badge>
                      </div>
                      {subject.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {subject.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No subjects assigned to this class yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Class Hours</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(classData.schedule?.startTime || '08:00')} - 
                        {formatTime(classData.schedule?.endTime || '15:00')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Location</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{classData.room || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-4">Weekly Schedule</p>
                  <div className="grid grid-cols-5 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                      const dayKey = day.toLowerCase()
                      const isActive = classData.schedule?.daysOfWeek?.includes(dayKey)
                      
                      return (
                        <div
                          key={day}
                          className={`p-4 rounded-lg border text-center ${
                            isActive 
                              ? 'bg-primary/10 border-primary/20' 
                              : 'bg-muted/50 border-muted'
                          }`}
                        >
                          <p className="font-medium text-sm">{day}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {isActive ? 'Active' : 'Off'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Enrollment</span>
                    <span className="font-bold">{classData.currentEnrollment}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Capacity</span>
                    <span className="font-bold">{classData.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Utilization</span>
                    <span className={`font-bold ${isOverCapacity ? 'text-red-600' : 'text-green-600'}`}>
                      {utilizationPercent.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={utilizationPercent} className="h-3" />
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
                      <span className="text-sm">Average Attendance</span>
                      <span className="text-sm font-medium">{performanceData.attendance}%</span>
                    </div>
                    <Progress value={performanceData.attendance} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Academic Performance</span>
                      <span className="text-sm font-medium">{performanceData.academicPerformance}%</span>
                    </div>
                    <Progress value={performanceData.academicPerformance} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Behavior Score</span>
                      <span className="text-sm font-medium">{performanceData.behaviorScore}%</span>
                    </div>
                    <Progress value={performanceData.behaviorScore} />
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