import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Import the same Class interface
interface Class {
  id: string
  name: string
  level: string
  section: string
  academicYear: string
  
  // Teacher Assignment
  classTeacher?: string
  classTeacherName?: string
  subjectTeachers?: Array<{
    teacherId: string
    teacherName: string
    subjectId: string
    subjectName: string
  }>
  
  // Enrollment & Capacity
  currentEnrollment: number
  maxCapacity: number
  
  // Schedule & Subjects
  subjects?: string[]
  schedule?: Array<{
    day: string
    periods: Array<{
      time: string
      subject: string
      teacher: string
    }>
  }>
  
  // Class Details
  classroom?: string
  description?: string
  isActive: boolean
  
  // System fields
  createdAt: string
  updatedAt: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

// This would be shared/imported in a real app
let MOCK_CLASSES: Class[] = [
  {
    id: 'class_1',
    name: 'Grade 10A',
    level: 'Grade 10',
    section: 'A',
    academicYear: '2024-2025',
    classTeacher: 'teacher_1',
    classTeacherName: 'Sarah Johnson',
    subjectTeachers: [
      {
        teacherId: 'teacher_1',
        teacherName: 'Sarah Johnson',
        subjectId: 'subject_1',
        subjectName: 'Advanced Mathematics'
      },
      {
        teacherId: 'teacher_2',
        teacherName: 'David Williams',
        subjectId: 'subject_2',
        subjectName: 'Physics'
      }
    ],
    currentEnrollment: 28,
    maxCapacity: 35,
    subjects: ['subject_1', 'subject_2', 'subject_3'],
    schedule: [
      {
        day: 'Monday',
        periods: [
          {
            time: '08:00-09:00',
            subject: 'Mathematics',
            teacher: 'Sarah Johnson'
          },
          {
            time: '09:00-10:00',
            subject: 'Physics',
            teacher: 'David Williams'
          }
        ]
      }
    ],
    classroom: 'Room 101',
    description: 'Advanced academic track for Grade 10 students',
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'class_2',
    name: 'Grade 9B',
    level: 'Grade 9',
    section: 'B',
    academicYear: '2024-2025',
    classTeacher: 'teacher_2',
    classTeacherName: 'David Williams',
    subjectTeachers: [
      {
        teacherId: 'teacher_2',
        teacherName: 'David Williams',
        subjectId: 'subject_2',
        subjectName: 'Physics'
      }
    ],
    currentEnrollment: 32,
    maxCapacity: 35,
    subjects: ['subject_2', 'subject_4'],
    schedule: [
      {
        day: 'Monday',
        periods: [
          {
            time: '08:00-09:00',
            subject: 'Physics',
            teacher: 'David Williams'
          }
        ]
      }
    ],
    classroom: 'Room 203',
    description: 'Science-focused class for Grade 9 students',
    isActive: true,
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z'
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

// GET /api/classes/[id] - Get specific class
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
    const classItem = MOCK_CLASSES.find(c => c.id === id)

    if (!classItem) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Class not found',
          errors: { class: ['No class found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: classItem,
      message: 'Class retrieved successfully'
    })

  } catch (error) {
    console.error('Get class error:', error)
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

// PUT /api/classes/[id] - Update class
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
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === id)

    if (classIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Class not found',
          errors: { class: ['No class found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    const updateData = await request.json()
    const currentClass = MOCK_CLASSES[classIndex]

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (updateData.name !== undefined && !updateData.name?.trim()) {
      errors.name = ['Class name is required']
    }
    
    if (updateData.level !== undefined && !updateData.level?.trim()) {
      errors.level = ['Grade level is required']
    }
    
    if (updateData.section !== undefined && !updateData.section?.trim()) {
      errors.section = ['Section is required']
    }
    
    if (updateData.academicYear !== undefined && !updateData.academicYear?.trim()) {
      errors.academicYear = ['Academic year is required']
    }

    if (updateData.maxCapacity !== undefined && (updateData.maxCapacity < 1)) {
      errors.maxCapacity = ['Maximum capacity must be at least 1']
    }

    // Check if class name already exists for the academic year (excluding current class)
    if (updateData.name && updateData.academicYear) {
      const existingClass = MOCK_CLASSES.find(c => 
        c.id !== id &&
        c.name.toLowerCase() === updateData.name.toLowerCase() && 
        c.academicYear === updateData.academicYear
      )
      if (existingClass) {
        errors.name = ['A class with this name already exists for this academic year']
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

    // Update class
    const updatedClass: Class = {
      ...currentClass,
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }

    MOCK_CLASSES[classIndex] = updatedClass

    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: 'Class updated successfully'
    })

  } catch (error) {
    console.error('Update class error:', error)
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

// DELETE /api/classes/[id] - Delete class
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
    const classIndex = MOCK_CLASSES.findIndex(c => c.id === id)

    if (classIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Class not found',
          errors: { class: ['No class found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    // Remove class
    const deletedClass = MOCK_CLASSES.splice(classIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedClass,
      message: 'Class deleted successfully'
    })

  } catch (error) {
    console.error('Delete class error:', error)
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