// Core entity type definitions
// These will be expanded in Prompt 3

export interface School {
  id: string
  name: string
  subdomain: string
  logo?: string
  address: Address
  contact: ContactInfo
  settings: SchoolSettings
  subscription: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface ContactInfo {
  email: string
  phone: string
  website?: string
}

export interface SchoolSettings {
  academicYear: {
    start: Date
    end: Date
  }
  termSystem: 'trimester' | 'semester'
  gradingSystem: {
    scale: string
    passingGrade: number
    gradePoints: Record<string, number>
  }
}

export interface SubscriptionPlan {
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'suspended' | 'cancelled'
  expiresAt: Date
}

export interface Student {
  id: string
  schoolId: string
  admissionNumber: string
  name: string
  email?: string
  phone?: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  address: Address
  guardian: Guardian
  classId: string
  kcpeMarks?: number
  status: 'active' | 'inactive' | 'graduated'
  enrollmentDate: Date
  profileImage?: string
}

export interface Guardian {
  name: string
  relationship: string
  email?: string
  phone: string
  address?: Address
}