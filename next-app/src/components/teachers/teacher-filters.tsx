'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Badge
} from '@/components'
import { TeacherFilters, Subject } from '@/lib/types'
import { X, Filter } from 'lucide-react'

interface TeacherFiltersPanelProps {
  filters: TeacherFilters
  onFiltersChange: (filters: TeacherFilters) => void
  subjects: Subject[]
}

export function TeacherFiltersPanel({ 
  filters, 
  onFiltersChange, 
  subjects 
}: TeacherFiltersPanelProps) {
  const [localFilters, setLocalFilters] = React.useState<TeacherFilters>(filters)

  const handleFilterChange = (key: keyof TeacherFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSubjectToggle = (subjectId: string) => {
    const currentSubjects = localFilters.subjects || []
    const newSubjects = currentSubjects.includes(subjectId)
      ? currentSubjects.filter(id => id !== subjectId)
      : [...currentSubjects, subjectId]
    
    handleFilterChange('subjects', newSubjects)
  }

  const clearFilter = (key: keyof TeacherFilters) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(localFilters).length > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={localFilters.status || ''}
              onValueChange={(value) => 
                handleFilterChange('status', value === 'all' ? undefined : value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            {localFilters.status && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('status')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gender</Label>
            <Select
              value={localFilters.gender || ''}
              onValueChange={(value) => 
                handleFilterChange('gender', value === 'all' ? undefined : value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {localFilters.gender && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('gender')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Contract Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contract Type</Label>
            <Select
              value={localFilters.contractType || ''}
              onValueChange={(value) => 
                handleFilterChange('contractType', value === 'all' ? undefined : value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
                <SelectItem value="substitute">Substitute</SelectItem>
              </SelectContent>
            </Select>
            {localFilters.contractType && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('contractType')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Experience Range Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Experience Range</Label>
            <Select
              value={localFilters.experienceRange || ''}
              onValueChange={(value) => 
                handleFilterChange('experienceRange', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
            {localFilters.experienceRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('experienceRange')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Hire Date From</Label>
            <Input
              type="date"
              value={localFilters.hireDateFrom || ''}
              onChange={(e) => handleFilterChange('hireDateFrom', e.target.value || undefined)}
            />
            {localFilters.hireDateFrom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('hireDateFrom')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Hire Date To</Label>
            <Input
              type="date"
              value={localFilters.hireDateTo || ''}
              onChange={(e) => handleFilterChange('hireDateTo', e.target.value || undefined)}
            />
            {localFilters.hireDateTo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('hireDateTo')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Subjects Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Subjects</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-subject-${subject.id}`}
                  checked={(localFilters.subjects || []).includes(subject.id)}
                  onCheckedChange={() => handleSubjectToggle(subject.id)}
                />
                <Label
                  htmlFor={`filter-subject-${subject.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {subject.name}
                </Label>
              </div>
            ))}
          </div>
          {localFilters.subjects && localFilters.subjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {localFilters.subjects.map((subjectId) => {
                  const subject = subjects.find(s => s.id === subjectId)
                  return subject ? (
                    <Badge key={subjectId} variant="secondary" className="text-xs">
                      {subject.name}
                      <button
                        onClick={() => handleSubjectToggle(subjectId)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter('subjects')}
                className="p-1 h-auto text-xs text-gray-500"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All Subjects
              </Button>
            </div>
          )}
        </div>

        {/* Qualification Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Qualification (Contains)</Label>
          <Input
            placeholder="e.g., Bachelor, Masters, PhD"
            value={localFilters.qualification || ''}
            onChange={(e) => handleFilterChange('qualification', e.target.value || undefined)}
          />
          {localFilters.qualification && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearFilter('qualification')}
              className="p-1 h-auto text-xs text-gray-500"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Salary Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Salary Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                placeholder="Min salary"
                value={localFilters.minSalary || ''}
                onChange={(e) => handleFilterChange('minSalary', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max salary"
                value={localFilters.maxSalary || ''}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
          {(localFilters.minSalary || localFilters.maxSalary) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearFilter('minSalary')
                clearFilter('maxSalary')
              }}
              className="p-1 h-auto text-xs text-gray-500"
            >
              <X className="h-3 w-3 mr-1" />
              Clear Salary Range
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Object.keys(localFilters).length} filter{Object.keys(localFilters).length !== 1 ? 's' : ''} applied
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}