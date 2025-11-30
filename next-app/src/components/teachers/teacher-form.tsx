'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Badge,
  FormWrapper
} from '@/components'
import { Teacher, CreateTeacherData, Subject, Class } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Calendar, Upload, X } from 'lucide-react'

// Validation schema
const teacherSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().optional(),
  qualification: z.string().min(1, 'Qualification is required'),
  experience: z.string().optional(),
  specialization: z.string().optional(),
  hireDate: z.string().min(1, 'Hire date is required'),
  contractType: z.enum(['permanent', 'contract', 'temporary', 'substitute']),
  status: z.enum(['active', 'inactive', 'on-leave']),
  salary: z.number().positive('Salary must be positive').optional(),
  subjects: z.array(z.string()).min(1, 'At least one subject must be selected'),
  classes: z.array(z.string()).optional(),
  tscNumber: z.string().optional(),
  idNumber: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
})

type TeacherFormData = z.infer<typeof teacherSchema>

interface TeacherFormProps {
  teacher?: Teacher
  subjects: Subject[]
  classes: Class[]
  onSubmit: (data: CreateTeacherData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function TeacherForm({ 
  teacher, 
  subjects, 
  classes, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: TeacherFormProps) {
  const [profileImage, setProfileImage] = React.useState<string | null>(teacher?.profileImage || null)
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>(teacher?.subjects || [])
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>(teacher?.classes || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher ? {
      employeeId: teacher.employeeId,
      name: teacher.name,
      email: teacher.email || '',
      phone: teacher.phone || '',
      gender: teacher.gender,
      dateOfBirth: teacher.dateOfBirth.toISOString().split('T')[0],
      address: teacher.address || '',
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      specialization: teacher.specialization || '',
      hireDate: teacher.hireDate.toISOString().split('T')[0],
      contractType: teacher.contractType,
      status: teacher.status,
      salary: teacher.salary || undefined,
      subjects: teacher.subjects || [],
      classes: teacher.classes || [],
      tscNumber: teacher.tscNumber || '',
      idNumber: teacher.idNumber || '',
      emergencyContact: teacher.emergencyContact || {
        name: '',
        phone: '',
        relationship: '',
      },
      notes: teacher.notes || '',
    } : {
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      gender: 'male',
      dateOfBirth: '',
      address: '',
      qualification: '',
      experience: '',
      specialization: '',
      hireDate: new Date().toISOString().split('T')[0],
      contractType: 'permanent',
      status: 'active',
      subjects: [],
      classes: [],
      tscNumber: '',
      idNumber: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      notes: '',
    }
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubjectToggle = (subjectId: string) => {
    const updatedSubjects = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter(id => id !== subjectId)
      : [...selectedSubjects, subjectId]
    
    setSelectedSubjects(updatedSubjects)
    setValue('subjects', updatedSubjects)
  }

  const handleClassToggle = (classId: string) => {
    const updatedClasses = selectedClasses.includes(classId)
      ? selectedClasses.filter(id => id !== classId)
      : [...selectedClasses, classId]
    
    setSelectedClasses(updatedClasses)
    setValue('classes', updatedClasses)
  }

  const onFormSubmit = async (data: TeacherFormData) => {
    try {
      const teacherData: CreateTeacherData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        hireDate: new Date(data.hireDate),
        subjects: selectedSubjects,
        classes: selectedClasses,
        profileImage: profileImage || undefined,
      }
      
      await onSubmit(teacherData)
    } catch (error) {
      console.error('Error submitting teacher form:', error)
    }
  }

  const formFields = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      fields: [
        {
          label: 'Employee ID',
          name: 'employeeId' as keyof TeacherFormData,
          type: 'text',
          required: true,
          placeholder: 'e.g., EMP001'
        },
        {
          label: 'Full Name',
          name: 'name' as keyof TeacherFormData,
          type: 'text',
          required: true,
          placeholder: 'Enter full name'
        },
        {
          label: 'Email Address',
          name: 'email' as keyof TeacherFormData,
          type: 'email',
          placeholder: 'teacher@example.com'
        },
        {
          label: 'Phone Number',
          name: 'phone' as keyof TeacherFormData,
          type: 'tel',
          placeholder: '+254 700 000 000'
        },
        {
          label: 'Gender',
          name: 'gender' as keyof TeacherFormData,
          type: 'select',
          required: true,
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ]
        },
        {
          label: 'Date of Birth',
          name: 'dateOfBirth' as keyof TeacherFormData,
          type: 'date',
          required: true
        },
        {
          label: 'Address',
          name: 'address' as keyof TeacherFormData,
          type: 'textarea',
          placeholder: 'Enter address'
        }
      ]
    },
    {
      id: 'professional-info',
      title: 'Professional Information',
      fields: [
        {
          label: 'Qualification',
          name: 'qualification' as keyof TeacherFormData,
          type: 'text',
          required: true,
          placeholder: 'e.g., Bachelor of Education (Mathematics)'
        },
        {
          label: 'Years of Experience',
          name: 'experience' as keyof TeacherFormData,
          type: 'text',
          placeholder: 'e.g., 5 years'
        },
        {
          label: 'Specialization',
          name: 'specialization' as keyof TeacherFormData,
          type: 'text',
          placeholder: 'e.g., Secondary Mathematics'
        },
        {
          label: 'TSC Number',
          name: 'tscNumber' as keyof TeacherFormData,
          type: 'text',
          placeholder: 'Teachers Service Commission Number'
        }
      ]
    },
    {
      id: 'employment-info',
      title: 'Employment Information',
      fields: [
        {
          label: 'Hire Date',
          name: 'hireDate' as keyof TeacherFormData,
          type: 'date',
          required: true
        },
        {
          label: 'Contract Type',
          name: 'contractType' as keyof TeacherFormData,
          type: 'select',
          required: true,
          options: [
            { value: 'permanent', label: 'Permanent' },
            { value: 'contract', label: 'Contract' },
            { value: 'temporary', label: 'Temporary' },
            { value: 'substitute', label: 'Substitute' }
          ]
        },
        {
          label: 'Status',
          name: 'status' as keyof TeacherFormData,
          type: 'select',
          required: true,
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'on-leave', label: 'On Leave' }
          ]
        },
        {
          label: 'Salary (Optional)',
          name: 'salary' as keyof TeacherFormData,
          type: 'number',
          placeholder: 'Monthly salary'
        }
      ]
    }
  ]

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Profile Picture Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profileImage ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setProfileImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </div>
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Sections */}
      <FormWrapper
        sections={formFields}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      {/* Subject Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Subjects to Teach *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <Label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.subjects && (
                <p className="text-red-600 text-sm mt-1">{errors.subjects.message}</p>
              )}
            </div>

            {selectedSubjects.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Subjects:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSubjects.map((subjectId) => {
                    const subject = subjects.find(s => s.id === subjectId)
                    return subject ? (
                      <Badge key={subjectId} variant="secondary">
                        {subject.name}
                        <button
                          type="button"
                          onClick={() => handleSubjectToggle(subjectId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Class Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Class Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Classes to Teach (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${classItem.id}`}
                      checked={selectedClasses.includes(classItem.id)}
                      onCheckedChange={() => handleClassToggle(classItem.id)}
                    />
                    <Label
                      htmlFor={`class-${classItem.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {classItem.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {selectedClasses.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Assigned Classes:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClasses.map((classId) => {
                    const classItem = classes.find(c => c.id === classId)
                    return classItem ? (
                      <Badge key={classId} variant="outline">
                        {classItem.name}
                        <button
                          type="button"
                          onClick={() => handleClassToggle(classId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact & Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="idNumber" className="text-sm font-medium">
              ID Number
            </Label>
            <Input
              id="idNumber"
              {...register('idNumber')}
              placeholder="National ID Number"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Emergency Contact</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <Input
                  {...register('emergencyContact.name')}
                  placeholder="Contact Name"
                />
              </div>
              <div>
                <Input
                  {...register('emergencyContact.phone')}
                  placeholder="Contact Phone"
                />
              </div>
              <div>
                <Input
                  {...register('emergencyContact.relationship')}
                  placeholder="Relationship"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about the teacher..."
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : teacher ? 'Update Teacher' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  )
}