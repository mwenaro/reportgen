'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { StudentForm } from '@/components/students/student-form'

export default function NewStudentPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/students')
  }

  const handleCancel = () => {
    router.push('/students')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}