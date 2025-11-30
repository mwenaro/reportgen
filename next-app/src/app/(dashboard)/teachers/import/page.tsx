'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  LoadingSpinner
} from '@/components'
import { TeacherImport } from '@/components/teachers/teacher-import'
import { useSubjects } from '@/lib/store/subjects'
import { useClasses } from '@/lib/store/classes'
import { ArrowLeft, Upload } from 'lucide-react'

export default function TeacherImportPage() {
  const router = useRouter()
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects()
  const { data: classes = [], isLoading: classesLoading } = useClasses()

  const handleImportComplete = (successCount: number) => {
    // Optionally show a success message or redirect
    router.push('/teachers')
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
          <h1 className="text-3xl font-bold">Import Teachers</h1>
          <p className="text-muted-foreground">
            Bulk import teacher data from CSV files
          </p>
        </div>
      </div>

      {/* Import Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Teacher Data Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherImport
            subjects={subjects}
            classes={classes}
            onImportComplete={handleImportComplete}
          />
        </CardContent>
      </Card>
    </div>
  )
}