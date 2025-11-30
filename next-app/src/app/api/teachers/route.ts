import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Types
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

// Mock data - replace with actual database
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

// GET /api/teachers - List all teachers with filtering and pagination
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const department = searchParams.get('department') || ''
    const sortBy = searchParams.get('sortBy') || 'lastName'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Filter teachers
    let filteredTeachers = [...MOCK_TEACHERS]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTeachers = filteredTeachers.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower) ||
        teacher.employeeId?.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.status === status)
    }

    if (department) {
      filteredTeachers = filteredTeachers.filter(teacher => teacher.department === department)
    }

    // Sort teachers
    filteredTeachers.sort((a, b) => {
      let aVal = ''
      let bVal = ''
      
      switch (sortBy) {
        case 'firstName':
          aVal = a.firstName
          bVal = b.firstName
          break
        case 'lastName':
          aVal = a.lastName
          bVal = b.lastName
          break
        case 'email':
          aVal = a.email
          bVal = b.email
          break
        case 'joiningDate':
          aVal = a.joiningDate || ''
          bVal = b.joiningDate || ''
          break
        case 'department':
          aVal = a.department || ''
          bVal = b.department || ''
          break
        default:
          aVal = a.lastName
          bVal = b.lastName
      }

      if (sortOrder === 'desc') {
        return bVal.localeCompare(aVal)
      }
      return aVal.localeCompare(bVal)
    })

    // Paginate
    const total = filteredTeachers.length
    const pages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedTeachers = filteredTeachers.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedTeachers,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      message: 'Teachers retrieved successfully'
    })

  } catch (error) {
    console.error('Get teachers error:', error)
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

// POST /api/teachers - Create new teacher
export async function POST(request: NextRequest) {
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

    const teacherData = await request.json()

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!teacherData.firstName?.trim()) {
      errors.firstName = ['First name is required']
    }
    
    if (!teacherData.lastName?.trim()) {
      errors.lastName = ['Last name is required']
    }
    
    if (!teacherData.email?.trim()) {
      errors.email = ['Email is required']
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(teacherData.email)) {
        errors.email = ['Please enter a valid email address']
      } else if (MOCK_TEACHERS.some(t => t.email.toLowerCase() === teacherData.email.toLowerCase())) {
        errors.email = ['This email is already in use']
      }
    }

    if (teacherData.employeeId && MOCK_TEACHERS.some(t => t.employeeId === teacherData.employeeId)) {
      errors.employeeId = ['This employee ID is already in use']
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

    // Create new teacher
    const newTeacher: Teacher = {
      id: `teacher_${Date.now()}`,
      firstName: teacherData.firstName.trim(),
      lastName: teacherData.lastName.trim(),
      email: teacherData.email.trim().toLowerCase(),
      phone: teacherData.phone?.trim() || '',
      address: teacherData.address?.trim() || '',
      dateOfBirth: teacherData.dateOfBirth || '',
      gender: teacherData.gender || undefined,
      employeeId: teacherData.employeeId?.trim() || '',
      qualification: teacherData.qualification?.trim() || '',
      experience: teacherData.experience?.trim() || '',
      specialization: teacherData.specialization?.trim() || '',
      subjects: teacherData.subjects || [],
      joiningDate: teacherData.joiningDate || new Date().toISOString().split('T')[0],
      contractType: teacherData.contractType || 'permanent',
      status: teacherData.status || 'active',
      department: teacherData.department?.trim() || '',
      position: teacherData.position?.trim() || '',
      emergencyContact: teacherData.emergencyContact || {},
      certifications: teacherData.certifications || [],
      trainings: teacherData.trainings || [],
      performanceRating: teacherData.performanceRating || undefined,
      lastReviewDate: teacherData.lastReviewDate || '',
      salary: teacherData.salary || undefined,
      benefits: teacherData.benefits || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    MOCK_TEACHERS.push(newTeacher)

    return NextResponse.json({
      success: true,
      data: newTeacher,
      message: 'Teacher created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create teacher error:', error)
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