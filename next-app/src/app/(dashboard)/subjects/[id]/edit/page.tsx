'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  LoadingSpinner,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@/components'
import { useSubject, useUpdateSubject } from '@/lib/store/subjects'
import { subjectValidation, type SubjectFormData } from '@/lib/validations/subject'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  params: Promise<{ id: string }>
}

const departments = [
  'Mathematics',
  'English',
  'Science',
  'Social Studies',
  'Computer Science',
  'Arts',
  'Physical Education',
  'Music',
  'Languages'
]

const academicLevels = [
  'Elementary',
  'Middle School',
  'High School',
  'Foundation',
  'Advanced'
]

export default function EditSubjectPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: subject, isLoading, error } = useSubject(id)
  const updateSubject = useUpdateSubject()

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectValidation),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      department: '',
      level: '',
      credits: 1,
      isActive: true
    }
  })

  // Update form values when subject data is loaded
  React.useEffect(() => {
    if (subject) {
      form.reset({
        name: subject.name,
        code: subject.code,
        description: subject.description || '',
        department: subject.department || '',
        level: subject.level || '',
        credits: subject.credits,
        isActive: subject.isActive
      })
    }
  }, [subject, form])

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

  const onSubmit = async (data: SubjectFormData) => {
    try {
      await updateSubject.mutateAsync({
        id,
        data: {
          ...data,
          updatedAt: new Date().toISOString()
        }
      })
      
      toast.success('Subject updated successfully!')
      router.push(`/subjects/${id}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to update subject:', error)
      toast.error('Failed to update subject. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Subject</h1>
            <p className="text-muted-foreground">
              Update subject information and settings
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Advanced Mathematics"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., MATH301"
                            {...field}
                          />
                        </FormControl>
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
                          placeholder="Brief description of the subject..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
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
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {academicLevels.map((level) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="credits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Hours *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Enable this subject for class assignment
                          </div>
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
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateSubject.isPending}
              >
                {updateSubject.isPending ? (
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Update Subject
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}