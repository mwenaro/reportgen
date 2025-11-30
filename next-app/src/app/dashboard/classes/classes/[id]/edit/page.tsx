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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MultiSelect,
  Textarea,
  Switch,
  LoadingSpinner
} from '@/components'
import { useClass, useUpdateClass } from '@/lib/store/classes'
import { useTeachers } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { CreateClassData } from '@/lib/types'
import { classSchema } from '@/lib/validations/class'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Users, BookOpen, GraduationCap } from 'lucide-react'

const levels = [
  'Kindergarten', 'Pre-K', 'K-1', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 
  'Grade 11', 'Grade 12', 'Form 1', 'Form 2', 'Form 3', 'Form 4'
]

const academicYears = [
  '2023/2024', '2024/2025', '2025/2026', '2026/2027'
]

type Props = {
  params: Promise<{ id: string }>
}

export default function EditClassPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: classData, isLoading: classLoading, error } = useClass(id)
  const updateClass = useUpdateClass()
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers()
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects()

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      level: '',
      section: '',
      description: '',
      capacity: 30,
      currentEnrollment: 0,
      academicYear: '2024/2025',
      classTeacherId: '',
      subjects: [],
      schedule: {
        startTime: '08:00',
        endTime: '15:00',
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      room: '',
      isActive: true
    }
  })

  // Update form when class data is loaded
  React.useEffect(() => {
    if (classData) {
      form.reset({
        name: classData.name,
        level: classData.level,
        section: classData.section,
        description: classData.description || '',
        capacity: classData.capacity,
        currentEnrollment: classData.currentEnrollment,
        academicYear: classData.academicYear,
        classTeacherId: classData.classTeacherId || '',
        subjects: classData.subjects || [],
        schedule: classData.schedule || {
          startTime: '08:00',
          endTime: '15:00',
          daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        room: classData.room || '',
        isActive: classData.isActive
      })
    }
  }, [classData, form])

  const isLoading = updateClass.isPending

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      const classUpdateData: CreateClassData = {
        ...values,
        subjects: values.subjects || []
      }
      
      await updateClass.mutateAsync({ id, data: classUpdateData })
      router.push(`/dashboard/classes/${id}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to update class:', error)
    }
  }

  if (classLoading) {
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

  const availableTeachers = teachers.filter(teacher => 
    teacher.status === 'active' && teacher.employmentStatus === 'full-time'
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
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
              <h1 className="text-3xl font-bold">Edit Class</h1>
              <p className="text-muted-foreground">
                Update {classData.name} information
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5A Mathematics" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique name for this class
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level/Grade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., A, B, C" {...field} />
                        </FormControl>
                        <FormDescription>
                          Section identifier
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum students
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentEnrollment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Enrollment</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Students enrolled
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the class, its objectives, and any special requirements..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Academic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {academicYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="classTeacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Teacher</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No teacher assigned</SelectItem>
                            {availableTeachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName} - {teacher.subjects?.join(', ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {teachersLoading ? 'Loading teachers...' : `${availableTeachers.length} teachers available`}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjects</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={subjects.map(subject => ({
                            value: subject.id,
                            label: `${subject.name} (${subject.code})`
                          }))}
                          onValueChange={field.onChange}
                          value={field.value}
                          placeholder="Select subjects taught in this class"
                          maxCount={8}
                        />
                      </FormControl>
                      <FormDescription>
                        {subjectsLoading ? 'Loading subjects...' : `${subjects.length} subjects available`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room/Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Room 101, Science Lab A" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary classroom or location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Schedule & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="schedule.startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Class
                        </FormLabel>
                        <FormDescription>
                          Enable this class for student enrollment and scheduling
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating Class...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Class
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}