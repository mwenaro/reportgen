import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface FormField {
  id: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'file'
  placeholder?: string
  value?: string | number | boolean
  defaultValue?: string | number | boolean
  required?: boolean
  disabled?: boolean
  options?: { label: string; value: string | number }[] // for select and radio
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null // return error message or null
  }
  className?: string
  helperText?: string
  rows?: number // for textarea
  accept?: string // for file input
}

export interface FormWrapperProps {
  title?: string
  description?: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
  className?: string
  layout?: 'vertical' | 'horizontal'
  columns?: 1 | 2 | 3
}

export interface FormErrors {
  [fieldId: string]: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function validateField(field: FormField, value: any): string | null {
  if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${field.label} is required`
  }

  if (!field.validation || !value) return null

  const { min, max, minLength, maxLength, pattern, custom } = field.validation

  // Number validations
  if (typeof value === 'number') {
    if (min !== undefined && value < min) {
      return `${field.label} must be at least ${min}`
    }
    if (max !== undefined && value > max) {
      return `${field.label} must be at most ${max}`
    }
  }

  // String validations
  if (typeof value === 'string') {
    if (minLength !== undefined && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters`
    }
    if (maxLength !== undefined && value.length > maxLength) {
      return `${field.label} must be at most ${maxLength} characters`
    }
    if (pattern && !pattern.test(value)) {
      return `${field.label} format is invalid`
    }
  }

  // Custom validation
  if (custom) {
    return custom(value)
  }

  return null
}

// ============================================================================
// FIELD COMPONENTS
// ============================================================================

interface FieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  error?: string
}

function TextField({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.id}
        type={field.type as any}
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        className={cn(error && 'border-destructive', field.className)}
        min={field.validation?.min}
        max={field.validation?.max}
        minLength={field.validation?.minLength}
        maxLength={field.validation?.maxLength}
        pattern={field.validation?.pattern?.source}
        accept={field.accept}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helperText && !error && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  )
}

function TextareaField({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <textarea
        id={field.id}
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        rows={field.rows || 3}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          field.className
        )}
        minLength={field.validation?.minLength}
        maxLength={field.validation?.maxLength}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helperText && !error && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  )
}

function SelectField({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <select
        id={field.id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          field.className
        )}
      >
        <option value="">{field.placeholder || `Select ${field.label}`}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helperText && !error && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  )
}

function CheckboxField({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          id={field.id}
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          disabled={field.disabled}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
            error && 'border-destructive',
            field.className
          )}
        />
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helperText && !error && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  )
}

function RadioField({ field, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="space-y-2">
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              id={`${field.id}-${option.value}`}
              type="radio"
              name={field.id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={field.disabled}
              className={cn(
                'h-4 w-4 border-gray-300 text-primary focus:ring-primary',
                error && 'border-destructive',
                field.className
              )}
            />
            <Label
              htmlFor={`${field.id}-${option.value}`}
              className="text-sm font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {field.helperText && !error && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FormWrapper({
  title,
  description,
  fields,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  loading = false,
  className,
  layout = 'vertical',
  columns = 1,
}: FormWrapperProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {}
    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue
      } else if (field.value !== undefined) {
        initialData[field.id] = field.value
      } else {
        // Set default values based on field type
        switch (field.type) {
          case 'checkbox':
            initialData[field.id] = false
            break
          case 'number':
            initialData[field.id] = ''
            break
          default:
            initialData[field.id] = ''
        }
      }
    })
    return initialData
  })

  const [errors, setErrors] = React.useState<FormErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  // Validate form
  const validateForm = React.useCallback(() => {
    const newErrors: FormErrors = {}
    let isValid = true

    fields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [fields, formData])

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setTouched((prev) => ({ ...prev, [fieldId]: true }))

    // Validate field on change if it was already touched
    if (touched[fieldId]) {
      const field = fields.find((f) => f.id === fieldId)
      if (field) {
        const error = validateField(field, value)
        setErrors((prev) => ({ ...prev, [fieldId]: error || '' }))
      }
    }
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    fields.forEach((field) => {
      allTouched[field.id] = true
    })
    setTouched(allTouched)

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // Render field
  const renderField = (field: FormField) => {
    const error = touched[field.id] ? errors[field.id] : undefined

    switch (field.type) {
      case 'textarea':
        return (
          <TextareaField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={error}
          />
        )
      case 'select':
        return (
          <SelectField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={error}
          />
        )
      case 'checkbox':
        return (
          <CheckboxField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={error}
          />
        )
      case 'radio':
        return (
          <RadioField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={error}
          />
        )
      default:
        return (
          <TextField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
            error={error}
          />
        )
    }
  }

  const gridClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1'

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cn('grid gap-4', gridClass)}>{fields.map(renderField)}</div>
          
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              )}
              {submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormWrapper