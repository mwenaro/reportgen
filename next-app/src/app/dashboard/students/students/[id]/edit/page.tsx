'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components'
import { useStudent } from '@/lib/store/students'
import { StudentForm } from '@/components/students/student-form'

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  
  const studentId = params.id as string
  const { data: student, isLoading, error } = useStudent(studentId)

  const handleSuccess = () => {
    router.push(`/students/${studentId}`)
  }

  const handleCancel = () => {
    router.push(`/students/${studentId}`)
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
        <div className="text-center">
          <p className="text-red-600">Student not found or failed to load</p>
          <button onClick={() => router.push('/students')} className="mt-4 text-blue-600">
            Back to Students
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentForm
        student={student}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}