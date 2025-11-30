'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TeacherForm } from '@/components/teachers/teacher-form'
import { useCreateTeacher } from '@/lib/store/teachers'
import { useSubjects } from '@/lib/store/subjects'
import { useClasses } from '@/lib/store/classes'
import { CreateTeacherData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '@/components'
import { ArrowLeft } from 'lucide-react'

export default function NewTeacherPage() {
  const router = useRouter()
  const createTeacher = useCreateTeacher()
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects()
  const { data: classes = [], isLoading: classesLoading } = useClasses()

  const handleSubmit = async (data: CreateTeacherData) => {
    try {
      await createTeacher.mutateAsync(data)
      router.push('/dashboard/teachers')
    } catch (error) {
      console.error('Failed to create teacher:', error)
      // Error handling would be managed by the form
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/teachers')
  }

  if (subjectsLoading || classesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
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
          <h1 className="text-3xl font-bold">Add New Teacher</h1>
          <p className="text-muted-foreground">
            Create a new teacher profile and assign subjects and classes
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
            subjects={subjects}
            classes={classes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createTeacher.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}