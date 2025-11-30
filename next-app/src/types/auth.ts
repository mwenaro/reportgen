// Authentication and user types
import { School } from './entities'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin', 
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ACCOUNTANT = 'accountant'
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export interface AuthSession {
  user: User
  school: School
  permissions: Permission[]
  expires: string
}