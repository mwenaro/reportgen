import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Import the same Subject interface
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

// This would be shared/imported in a real app
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

// GET /api/subjects/[id] - Get specific subject
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
    const subject = MOCK_SUBJECTS.find(s => s.id === id)

    if (!subject) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subject not found',
          errors: { subject: ['No subject found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: subject,
      message: 'Subject retrieved successfully'
    })

  } catch (error) {
    console.error('Get subject error:', error)
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

// PUT /api/subjects/[id] - Update subject
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
    const subjectIndex = MOCK_SUBJECTS.findIndex(s => s.id === id)

    if (subjectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subject not found',
          errors: { subject: ['No subject found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    const updateData = await request.json()
    const currentSubject = MOCK_SUBJECTS[subjectIndex]

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (updateData.name !== undefined && !updateData.name?.trim()) {
      errors.name = ['Subject name is required']
    }
    
    if (updateData.code !== undefined) {
      if (!updateData.code?.trim()) {
        errors.code = ['Subject code is required']
      } else {
        const existingSubject = MOCK_SUBJECTS.find(s => 
          s.id !== id && s.code.toLowerCase() === updateData.code.toLowerCase()
        )
        if (existingSubject) {
          errors.code = ['This subject code is already in use']
        }
      }
    }

    if (updateData.credits !== undefined && (updateData.credits < 1 || updateData.credits > 10)) {
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

    // Update subject
    const updatedSubject: Subject = {
      ...currentSubject,
      ...updateData,
      id, // Ensure ID doesn't change
      code: updateData.code ? updateData.code.trim().toUpperCase() : currentSubject.code,
      updatedAt: new Date().toISOString()
    }

    MOCK_SUBJECTS[subjectIndex] = updatedSubject

    return NextResponse.json({
      success: true,
      data: updatedSubject,
      message: 'Subject updated successfully'
    })

  } catch (error) {
    console.error('Update subject error:', error)
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

// DELETE /api/subjects/[id] - Delete subject
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
    const subjectIndex = MOCK_SUBJECTS.findIndex(s => s.id === id)

    if (subjectIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subject not found',
          errors: { subject: ['No subject found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    // Remove subject
    const deletedSubject = MOCK_SUBJECTS.splice(subjectIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedSubject,
      message: 'Subject deleted successfully'
    })

  } catch (error) {
    console.error('Delete subject error:', error)
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