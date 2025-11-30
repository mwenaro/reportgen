'use client'

import React from 'react'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Users, GraduationCap } from 'lucide-react'
import { 
  Button, 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormWrapper,
  useNotify,
  LoadingSpinner
} from '@/components'
import { useCreateStudent } from '@/lib/store/students'
import { useClasses } from '@/lib/store/classes'
import { FormField, Student } from '@/lib/types'
import { generateAdmissionNumber } from '@/lib/utils'

interface StudentFormProps {
  student?: Student
  onSuccess: () => void
  onCancel: () => void
}

export function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const notify = useNotify()
  const createStudent = useCreateStudent()
  const { data: classes = [] } = useClasses()
  
  const isEditing = !!student

  // Form fields configuration
  const formFields: FormField[] = [
    // Personal Information Section
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter student\'s full name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      id: 'admissionNumber',
      label: 'Admission Number',
      type: 'text',
      placeholder: 'Auto-generated or enter custom',
      defaultValue: isEditing ? student?.admissionNumber : generateAdmissionNumber(),
      required: true,
      validation: {
        pattern: /^[A-Z0-9\/\-]+$/,
        custom: (value: string) => {
          if (value.length < 3) return 'Admission number must be at least 3 characters'
          return null
        }
      },
      helperText: 'Format: STD/2024/001 or similar',
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'student@example.com',
      required: false,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+254 700 000 000',
      required: false,
      validation: {
        pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
      },
    },
    {
      id: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      validation: {
        custom: (value: string) => {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          if (age < 3 || age > 25) {
            return 'Student age must be between 3 and 25 years'
          }
          return null
        }
      },
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    
    // Academic Information
    {
      id: 'classId',
      label: 'Class',
      type: 'select',
      required: true,
      options: classes.map(cls => ({
        label: cls.name,
        value: cls.id,
      })),
      placeholder: 'Select a class',
    },
    {
      id: 'kcpeMarks',
      label: 'KCPE Marks (Optional)',
      type: 'number',
      placeholder: '0-500',
      required: false,
      validation: {
        min: 0,
        max: 500,
      },
      helperText: 'Kenya Certificate of Primary Education marks',
    },
    {
      id: 'enrollmentDate',
      label: 'Enrollment Date',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Graduated', value: 'graduated' },
        { label: 'Transferred', value: 'transferred' },
      ],
    },
    
    // Address Information
    {
      id: 'address.street',
      label: 'Street Address',
      type: 'text',
      placeholder: 'Street address, P.O. Box, etc.',
      required: false,
    },
    {
      id: 'address.city',
      label: 'City/Town',
      type: 'text',
      placeholder: 'City or town',
      required: false,
    },
    {
      id: 'address.county',
      label: 'County',
      type: 'text',
      placeholder: 'County',
      required: false,
    },
    {
      id: 'address.postalCode',
      label: 'Postal Code',
      type: 'text',
      placeholder: '00100',
      required: false,
    },
    
    // Guardian Information
    {
      id: 'guardian.name',
      label: 'Guardian Full Name',
      type: 'text',
      placeholder: 'Parent/Guardian name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      id: 'guardian.relationship',
      label: 'Relationship',
      type: 'select',
      required: true,
      options: [
        { label: 'Father', value: 'father' },
        { label: 'Mother', value: 'mother' },
        { label: 'Guardian', value: 'guardian' },
        { label: 'Grandparent', value: 'grandparent' },
        { label: 'Uncle', value: 'uncle' },
        { label: 'Aunt', value: 'aunt' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'guardian.phone',
      label: 'Guardian Phone',
      type: 'tel',
      placeholder: '+254 700 000 000',
      required: true,
      validation: {
        pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
      },
    },
    {
      id: 'guardian.email',
      label: 'Guardian Email',
      type: 'email',
      placeholder: 'guardian@example.com',
      required: false,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      id: 'guardian.occupation',
      label: 'Guardian Occupation',
      type: 'text',
      placeholder: 'Occupation',
      required: false,
    },
    
    // Additional Information
    {
      id: 'medicalInfo',
      label: 'Medical Information',
      type: 'textarea',
      placeholder: 'Any medical conditions, allergies, or special needs...',
      required: false,
      rows: 3,
      helperText: 'Optional: Medical conditions or special needs',
    },
    {
      id: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      placeholder: 'Any additional information about the student...',
      required: false,
      rows: 3,
    },
  ]

  // Handle form submission
  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      // Transform flat form data to nested structure
      const studentData = {
        name: formData.name,
        admissionNumber: formData.admissionNumber,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        classId: formData.classId,
        kcpeMarks: formData.kcpeMarks ? parseInt(formData.kcpeMarks) : undefined,
        enrollmentDate: new Date(formData.enrollmentDate),
        status: formData.status,
        address: {
          street: formData['address.street'] || '',
          city: formData['address.city'] || '',
          county: formData['address.county'] || '',
          postalCode: formData['address.postalCode'] || '',
        },
        guardian: {
          name: formData['guardian.name'],
          relationship: formData['guardian.relationship'],
          phone: formData['guardian.phone'],
          email: formData['guardian.email'] || undefined,
          occupation: formData['guardian.occupation'] || undefined,
        },
        medicalInfo: formData.medicalInfo || undefined,
        notes: formData.notes || undefined,
      }

      if (isEditing) {
        // TODO: Implement update student
        // await updateStudent.mutateAsync({ id: student.id, data: studentData })
        console.log('Update student:', studentData)
      } else {
        await createStudent.mutateAsync(studentData)
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error saving student:', error)
      notify.error(isEditing ? 'Failed to update student' : 'Failed to create student')
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update student information' : 'Enter student details to create a new profile'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <FormWrapper
            fields={formFields}
            onSubmit={handleSubmit}
            submitText={isEditing ? 'Update Student' : 'Add Student'}
            cancelText="Cancel"
            onCancel={onCancel}
            loading={createStudent.isPending}
            columns={2}
            className="bg-background"
          />
        </div>

        {/* Information Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Full name is required and must be at least 2 characters</p>
              <p>• Admission number will be auto-generated if not provided</p>
              <p>• Email and phone are optional but recommended</p>
              <p>• Date of birth is used to calculate age</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Class assignment is required for enrollment</p>
              <p>• KCPE marks are optional (0-500 range)</p>
              <p>• Enrollment date defaults to today</p>
              <p>• Status can be changed later if needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guardian Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Guardian name and phone are required</p>
              <p>• Relationship helps identify the guardian type</p>
              <p>• Email is optional but useful for communication</p>
              <p>• Occupation is for record keeping purposes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Additional Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Address information is optional</p>
              <p>• Medical info helps with emergency situations</p>
              <p>• Notes field for any special considerations</p>
              <p>• All additional fields can be updated later</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}