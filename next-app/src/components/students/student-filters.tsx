'use client'

import React from 'react'
import { X, Filter } from 'lucide-react'
import { 
  Button, 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label
} from '@/components'
import { StudentFilters } from '@/lib/types'
import { useClasses } from '@/lib/store/classes'

interface StudentFiltersPanelProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  onClose: () => void
}

export function StudentFiltersPanel({ 
  filters, 
  onFiltersChange, 
  onClose 
}: StudentFiltersPanelProps) {
  const { data: classes = [] } = useClasses()
  const [localFilters, setLocalFilters] = React.useState<StudentFilters>(filters)

  const updateFilter = (key: keyof StudentFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const applyFilters = () => {
    // Remove empty filters
    const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key as keyof StudentFilters] = value
      }
      return acc
    }, {} as StudentFilters)
    
    onFiltersChange(cleanFilters)
    onClose()
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
    onClose()
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-lg font-semibold">Filter Students</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount} active</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Academic Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Class Filter */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">CLASS</Label>
              <select
                value={localFilters.classId || ''}
                onChange={(e) => updateFilter('classId', e.target.value)}
                className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">STATUS</Label>
              <select
                value={localFilters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>

            {/* KCPE Marks Range */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">KCPE MARKS RANGE</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  min={0}
                  max={500}
                  value={localFilters.kcpeMarksMin || ''}
                  onChange={(e) => updateFilter('kcpeMarksMin', e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  min={0}
                  max={500}
                  value={localFilters.kcpeMarksMax || ''}
                  onChange={(e) => updateFilter('kcpeMarksMax', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gender Filter */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GENDER</Label>
              <select
                value={localFilters.gender || ''}
                onChange={(e) => updateFilter('gender', e.target.value)}
                className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Age Range */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">AGE RANGE</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min age"
                  min={3}
                  max={25}
                  value={localFilters.ageMin || ''}
                  onChange={(e) => updateFilter('ageMin', e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max age"
                  min={3}
                  max={25}
                  value={localFilters.ageMax || ''}
                  onChange={(e) => updateFilter('ageMax', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Enrollment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enrollment Date Range */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">ENROLLMENT DATE</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Input
                    type="date"
                    value={localFilters.enrollmentDateFrom || ''}
                    onChange={(e) => updateFilter('enrollmentDateFrom', e.target.value)}
                  />
                  <Label className="text-xs text-muted-foreground mt-1">From</Label>
                </div>
                <div>
                  <Input
                    type="date"
                    value={localFilters.enrollmentDateTo || ''}
                    onChange={(e) => updateFilter('enrollmentDateTo', e.target.value)}
                  />
                  <Label className="text-xs text-muted-foreground mt-1">To</Label>
                </div>
              </div>
            </div>

            {/* Has Email Filter */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">CONTACT INFORMATION</Label>
              <div className="space-y-2 mt-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.hasEmail || false}
                    onChange={(e) => updateFilter('hasEmail', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Has email address</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.hasPhone || false}
                    onChange={(e) => updateFilter('hasPhone', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Has phone number</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Guardian Relationship */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">GUARDIAN RELATIONSHIP</Label>
              <select
                value={localFilters.guardianRelationship || ''}
                onChange={(e) => updateFilter('guardianRelationship', e.target.value)}
                className="w-full mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">All Relationships</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="uncle">Uncle</option>
                <option value="aunt">Aunt</option>
                <option value="other">Other</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={clearFilters}>
          Clear All
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}