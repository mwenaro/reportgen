'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { TeacherForm } from '@/components/teachers/teacher-form'
import { useTeacher, useUpdateTeacher } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { useClasses } from '@/lib/store/classes'
import { CreateTeacherData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '@/components'
import { ArrowLeft } from 'lucide-react'

export default function EditTeacherPage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params.id as string

  const { data: teacher, isLoading: teacherLoading, error } = useTeacher(teacherId)
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects()
  const { data: classes = [], isLoading: classesLoading } = useClasses()
  const updateTeacher = useUpdateTeacher()

  const handleSubmit = async (data: CreateTeacherData) => {
    try {
      await updateTeacher.mutateAsync({ id: teacherId, data })
      router.push(`/dashboard/teachers/${teacherId}`)
    } catch (error) {
      console.error('Failed to update teacher:', error)
    }
  }

  const handleCancel = () => {
    router.push(`/teachers/${teacherId}`)
  }

  if (teacherLoading || subjectsLoading || classesLoading) {
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
              <button 
                onClick={() => router.push('/dashboard/teachers')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Teachers
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">Edit Teacher</h1>
          <p className="text-muted-foreground">
            Update {teacher.name}'s information and assignments
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherForm
            teacher={teacher}
            subjects={subjects}
            classes={classes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateTeacher.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}