import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Types
interface Subject {
  id: string
  name: string
  code: string
  description?: string
  department?: string
  level?: string
  credits: number
  isActive: boolean
  
  // System fields
  createdAt: string
  updatedAt: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

// Mock data - replace with actual database
let MOCK_SUBJECTS: Subject[] = [
  {
    id: 'subject_1',
    name: 'Advanced Mathematics',
    code: 'MATH301',
    description: 'Advanced mathematical concepts including calculus, algebra, and geometry',
    department: 'Mathematics',
    level: 'High School',
    credits: 3,
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'subject_2',
    name: 'Physics Fundamentals',
    code: 'PHYS101',
    description: 'Introduction to physics concepts and principles',
    department: 'Science',
    level: 'Foundation',
    credits: 2,
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z'
  },
  {
    id: 'subject_3',
    name: 'English Literature',
    code: 'ENG201',
    description: 'Study of literary works and critical analysis',
    department: 'English',
    level: 'Middle School',
    credits: 2,
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-09-20T00:00:00Z'
  },
  {
    id: 'subject_4',
    name: 'Computer Science Basics',
    code: 'CS101',
    description: 'Introduction to programming and computer science concepts',
    department: 'Computer Science',
    level: 'Foundation',
    credits: 3,
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-10-30T00:00:00Z'
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

// GET /api/subjects - List all subjects with filtering and pagination
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
    const department = searchParams.get('department') || ''
    const level = searchParams.get('level') || ''
    const isActive = searchParams.get('isActive')
    const credits = searchParams.get('credits')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Filter subjects
    let filteredSubjects = [...MOCK_SUBJECTS]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSubjects = filteredSubjects.filter(subject =>
        subject.name.toLowerCase().includes(searchLower) ||
        subject.code.toLowerCase().includes(searchLower) ||
        subject.description?.toLowerCase().includes(searchLower)
      )
    }

    if (department) {
      filteredSubjects = filteredSubjects.filter(subject => subject.department === department)
    }

    if (level) {
      filteredSubjects = filteredSubjects.filter(subject => subject.level === level)
    }

    if (isActive !== null && isActive !== '') {
      const activeStatus = isActive === 'true'
      filteredSubjects = filteredSubjects.filter(subject => subject.isActive === activeStatus)
    }

    if (credits) {
      const creditValue = parseInt(credits)
      filteredSubjects = filteredSubjects.filter(subject => subject.credits === creditValue)
    }

    // Sort subjects
    filteredSubjects.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''
      
      switch (sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'code':
          aVal = a.code
          bVal = b.code
          break
        case 'department':
          aVal = a.department || ''
          bVal = b.department || ''
          break
        case 'level':
          aVal = a.level || ''
          bVal = b.level || ''
          break
        case 'credits':
          aVal = a.credits
          bVal = b.credits
          break
        case 'createdAt':
          aVal = a.createdAt
          bVal = b.createdAt
          break
        default:
          aVal = a.name
          bVal = b.name
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        if (sortOrder === 'desc') {
          return bVal.localeCompare(aVal)
        }
        return aVal.localeCompare(bVal)
      }
      
      return 0
    })

    // Paginate
    const total = filteredSubjects.length
    const pages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedSubjects = filteredSubjects.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedSubjects,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      message: 'Subjects retrieved successfully'
    })

  } catch (error) {
    console.error('Get subjects error:', error)
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

// POST /api/subjects - Create new subject
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

    const subjectData = await request.json()

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!subjectData.name?.trim()) {
      errors.name = ['Subject name is required']
    }
    
    if (!subjectData.code?.trim()) {
      errors.code = ['Subject code is required']
    } else if (MOCK_SUBJECTS.some(s => s.code.toLowerCase() === subjectData.code.toLowerCase())) {
      errors.code = ['This subject code is already in use']
    }

    if (!subjectData.credits || subjectData.credits < 1 || subjectData.credits > 10) {
      errors.credits = ['Credits must be between 1 and 10']
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

    // Create new subject
    const newSubject: Subject = {
      id: `subject_${Date.now()}`,
      name: subjectData.name.trim(),
      code: subjectData.code.trim().toUpperCase(),
      description: subjectData.description?.trim() || '',
      department: subjectData.department?.trim() || '',
      level: subjectData.level?.trim() || '',
      credits: subjectData.credits,
      isActive: subjectData.isActive !== false, // Default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    MOCK_SUBJECTS.push(newSubject)

    return NextResponse.json({
      success: true,
      data: newSubject,
      message: 'Subject created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create subject error:', error)
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