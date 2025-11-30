'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
  Switch,
  Label
} from '@/components'
import { ClassFilters } from '@/lib/types'
import { Teacher } from '@/lib/types'
import { X, Filter } from 'lucide-react'

interface ClassFiltersPanelProps {
  filters: ClassFilters
  onFiltersChange: (filters: ClassFilters) => void
  teachers: Teacher[]
}

const levels = [
  'Kindergarten', 'Pre-K', 'K-1', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 
  'Grade 11', 'Grade 12', 'Form 1', 'Form 2', 'Form 3', 'Form 4'
]

const academicYears = [
  '2023/2024', '2024/2025', '2025/2026', '2026/2027'
]

export function ClassFiltersPanel({ filters, onFiltersChange, teachers }: ClassFiltersPanelProps) {
  const handleFilterChange = (key: keyof ClassFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  )

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filters</h3>
            {hasActiveFilters && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length} active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Level</Label>
            <Select
              value={filters.level || ''}
              onValueChange={(value) => handleFilterChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Academic Year Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Academic Year</Label>
            <Select
              value={filters.academicYear || ''}
              onValueChange={(value) => handleFilterChange('academicYear', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All years</SelectItem>
                {academicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Teacher Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Class Teacher</Label>
            <Select
              value={filters.classTeacherId || ''}
              onValueChange={(value) => handleFilterChange('classTeacherId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All teachers</SelectItem>
                {teachers
                  .filter(teacher => teacher.status === 'active')
                  .map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.isActive ?? true}
                onCheckedChange={(checked) => handleFilterChange('isActive', checked)}
              />
              <span className="text-sm">Active Only</span>
            </div>
          </div>

          {/* Enrollment Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Enrollment</Label>
            <Input
              type="number"
              placeholder="Min students"
              value={filters.minEnrollment || ''}
              onChange={(e) => handleFilterChange('minEnrollment', parseInt(e.target.value) || undefined)}
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Enrollment</Label>
            <Input
              type="number"
              placeholder="Max students"
              value={filters.maxEnrollment || ''}
              onChange={(e) => handleFilterChange('maxEnrollment', parseInt(e.target.value) || undefined)}
              min="0"
              max="100"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.level && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Level: {filters.level}
                  <button
                    onClick={() => handleFilterChange('level', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {filters.academicYear && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Year: {filters.academicYear}
                  <button
                    onClick={() => handleFilterChange('academicYear', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.classTeacherId && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Teacher: {teachers.find(t => t.id === filters.classTeacherId)?.firstName || 'Unknown'}
                  <button
                    onClick={() => handleFilterChange('classTeacherId', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.minEnrollment !== undefined && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Min: {filters.minEnrollment}
                  <button
                    onClick={() => handleFilterChange('minEnrollment', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.maxEnrollment !== undefined && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Max: {filters.maxEnrollment}
                  <button
                    onClick={() => handleFilterChange('maxEnrollment', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}