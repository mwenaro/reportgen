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
import { SubjectFilters } from '@/lib/types'
import { X, Filter } from 'lucide-react'

interface SubjectFiltersPanelProps {
  filters: SubjectFilters
  onFiltersChange: (filters: SubjectFilters) => void
}

const departments = [
  'Sciences', 'Languages', 'Arts', 'Humanities', 'Technology', 'Early Learning'
]

const levels = [
  'Kindergarten', 'Primary', 'Secondary', 'Senior Secondary'
]

export function SubjectFiltersPanel({ filters, onFiltersChange }: SubjectFiltersPanelProps) {
  const handleFilterChange = (key: keyof SubjectFilters, value: any) => {
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
          {/* Department Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Department</Label>
            <Select
              value={filters.department || ''}
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {/* Teachers Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Teachers</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.hasTeachers ?? false}
                onCheckedChange={(checked) => handleFilterChange('hasTeachers', checked ? true : undefined)}
              />
              <span className="text-sm">Has Teachers</span>
            </div>
          </div>

          {/* Credit Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Credits</Label>
            <Input
              type="number"
              placeholder="Min credits"
              value={filters.minCredits || ''}
              onChange={(e) => handleFilterChange('minCredits', parseInt(e.target.value) || undefined)}
              min="0"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Credits</Label>
            <Input
              type="number"
              placeholder="Max credits"
              value={filters.maxCredits || ''}
              onChange={(e) => handleFilterChange('maxCredits', parseInt(e.target.value) || undefined)}
              min="0"
              max="10"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.department && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Department: {filters.department}
                  <button
                    onClick={() => handleFilterChange('department', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
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

              {filters.hasTeachers && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Has Teachers
                  <button
                    onClick={() => handleFilterChange('hasTeachers', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.minCredits !== undefined && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Min Credits: {filters.minCredits}
                  <button
                    onClick={() => handleFilterChange('minCredits', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {filters.maxCredits !== undefined && (
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  Max Credits: {filters.maxCredits}
                  <button
                    onClick={() => handleFilterChange('maxCredits', undefined)}
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