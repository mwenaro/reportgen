import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Import the same Teacher interface and mock data
interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  
  // Professional Information
  employeeId?: string
  qualification?: string
  experience?: string
  specialization?: string
  subjects?: string[]
  
  // Employment Details
  joiningDate?: string
  contractType?: 'permanent' | 'contract' | 'part-time'
  status: 'active' | 'inactive' | 'on-leave'
  department?: string
  position?: string
  
  // Contact Information
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  
  // Professional Development
  certifications?: string[]
  trainings?: Array<{
    title?: string
    provider?: string
    completionDate?: string
  }>
  
  // Performance & Compensation
  performanceRating?: number
  lastReviewDate?: string
  salary?: number
  benefits?: string[]
  
  // System fields
  createdAt: string
  updatedAt: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

// This would be shared/imported in a real app
let MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher_1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1-555-0101',
    address: '123 Education St, Learning City, LC 12345',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    employeeId: 'EMP001',
    qualification: 'Master of Education (Mathematics)',
    experience: '8 years',
    specialization: 'Advanced Mathematics',
    subjects: ['mathematics', 'algebra', 'geometry'],
    joiningDate: '2020-08-15',
    contractType: 'permanent',
    status: 'active',
    department: 'Mathematics',
    position: 'Senior Mathematics Teacher',
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Spouse',
      phone: '+1-555-0102'
    },
    certifications: ['TSC Registration', 'Mathematics Education Certificate'],
    trainings: [
      {
        title: 'Modern Teaching Methods',
        provider: 'Educational Institute',
        completionDate: '2023-06-15'
      }
    ],
    performanceRating: 4.5,
    lastReviewDate: '2024-01-15',
    salary: 65000,
    benefits: ['Health Insurance', 'Pension Plan', 'Professional Development Fund'],
    createdAt: '2020-08-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'teacher_2',
    firstName: 'David',
    lastName: 'Williams',
    email: 'david.williams@school.edu',
    phone: '+1-555-0201',
    address: '456 Teaching Ave, Education Town, ET 67890',
    dateOfBirth: '1979-11-22',
    gender: 'male',
    employeeId: 'EMP002',
    qualification: 'Bachelor of Science (Physics)',
    experience: '12 years',
    specialization: 'Physics and Chemistry',
    subjects: ['physics', 'chemistry'],
    joiningDate: '2018-01-20',
    contractType: 'permanent',
    status: 'active',
    department: 'Science',
    position: 'Head of Science Department',
    emergencyContact: {
      name: 'Emma Williams',
      relationship: 'Spouse',
      phone: '+1-555-0202'
    },
    certifications: ['TSC Registration', 'Science Education Certificate', 'Laboratory Safety Certificate'],
    trainings: [
      {
        title: 'Laboratory Management',
        provider: 'Science Education Council',
        completionDate: '2023-09-10'
      },
      {
        title: 'STEM Integration',
        provider: 'Educational Technology Institute',
        completionDate: '2024-02-20'
      }
    ],
    performanceRating: 4.8,
    lastReviewDate: '2024-02-01',
    salary: 72000,
    benefits: ['Health Insurance', 'Pension Plan', 'Leadership Allowance'],
    createdAt: '2018-01-20T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
]

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// GET /api/teachers/[id] - Get specific teacher
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required',
          errors: { auth: ['Please login to access this resource'] }
        },
        { status: 401 }
      )
    }

    const { id } = params
    const teacher = MOCK_TEACHERS.find(t => t.id === id)

    if (!teacher) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Teacher not found',
          errors: { teacher: ['No teacher found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teacher,
      message: 'Teacher retrieved successfully'
    })

  } catch (error) {
    console.error('Get teacher error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: { server: ['An unexpected error occurred'] }
      },
      { status: 500 }
    )
  }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required',
          errors: { auth: ['Please login to access this resource'] }
        },
        { status: 401 }
      )
    }

    const { id } = params
    const teacherIndex = MOCK_TEACHERS.findIndex(t => t.id === id)

    if (teacherIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Teacher not found',
          errors: { teacher: ['No teacher found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    const updateData = await request.json()
    const currentTeacher = MOCK_TEACHERS[teacherIndex]

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (updateData.firstName !== undefined && !updateData.firstName?.trim()) {
      errors.firstName = ['First name is required']
    }
    
    if (updateData.lastName !== undefined && !updateData.lastName?.trim()) {
      errors.lastName = ['Last name is required']
    }
    
    if (updateData.email !== undefined) {
      if (!updateData.email?.trim()) {
        errors.email = ['Email is required']
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(updateData.email)) {
          errors.email = ['Please enter a valid email address']
        } else {
          const existingTeacher = MOCK_TEACHERS.find(t => 
            t.id !== id && t.email.toLowerCase() === updateData.email.toLowerCase()
          )
          if (existingTeacher) {
            errors.email = ['This email is already in use']
          }
        }
      }
    }

    if (updateData.employeeId !== undefined && updateData.employeeId) {
      const existingTeacher = MOCK_TEACHERS.find(t => 
        t.id !== id && t.employeeId === updateData.employeeId
      )
      if (existingTeacher) {
        errors.employeeId = ['This employee ID is already in use']
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    // Update teacher
    const updatedTeacher: Teacher = {
      ...currentTeacher,
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }

    MOCK_TEACHERS[teacherIndex] = updatedTeacher

    return NextResponse.json({
      success: true,
      data: updatedTeacher,
      message: 'Teacher updated successfully'
    })

  } catch (error) {
    console.error('Update teacher error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: { server: ['An unexpected error occurred'] }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers/[id] - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required',
          errors: { auth: ['Please login to access this resource'] }
        },
        { status: 401 }
      )
    }

    const { id } = params
    const teacherIndex = MOCK_TEACHERS.findIndex(t => t.id === id)

    if (teacherIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Teacher not found',
          errors: { teacher: ['No teacher found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    // Remove teacher
    const deletedTeacher = MOCK_TEACHERS.splice(teacherIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedTeacher,
      message: 'Teacher deleted successfully'
    })

  } catch (error) {
    console.error('Delete teacher error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: { server: ['An unexpected error occurred'] }
      },
      { status: 500 }
    )
  }
}