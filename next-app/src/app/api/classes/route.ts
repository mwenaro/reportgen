import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import ClassModel from '@/lib/models/class.model'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'
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

// GET /api/classes - List all classes with filtering and pagination
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
    const level = searchParams.get('level') || ''
    const academicYear = searchParams.get('academicYear') || ''
    const classTeacher = searchParams.get('classTeacher') || ''
    const isActive = searchParams.get('isActive')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Filter classes
    let filteredClasses = [...MOCK_CLASSES]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredClasses = filteredClasses.filter(cls =>
        cls.name.toLowerCase().includes(searchLower) ||
        cls.level.toLowerCase().includes(searchLower) ||
        cls.section.toLowerCase().includes(searchLower) ||
        cls.classTeacherName?.toLowerCase().includes(searchLower)
      )
    }

    if (level) {
      filteredClasses = filteredClasses.filter(cls => cls.level === level)
    }

    if (academicYear) {
      filteredClasses = filteredClasses.filter(cls => cls.academicYear === academicYear)
    }

    if (classTeacher) {
      filteredClasses = filteredClasses.filter(cls => cls.classTeacher === classTeacher)
    }

    if (isActive !== null && isActive !== '') {
      const activeStatus = isActive === 'true'
      filteredClasses = filteredClasses.filter(cls => cls.isActive === activeStatus)
    }

    // Sort classes
    filteredClasses.sort((a, b) => {
      let aVal = ''
      let bVal = ''
      
      switch (sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'level':
          aVal = a.level
          bVal = b.level
          break
        case 'section':
          aVal = a.section
          bVal = b.section
          break
        case 'academicYear':
          aVal = a.academicYear
          bVal = b.academicYear
          break
        case 'currentEnrollment':
          return sortOrder === 'desc' 
            ? b.currentEnrollment - a.currentEnrollment
            : a.currentEnrollment - b.currentEnrollment
        case 'maxCapacity':
          return sortOrder === 'desc' 
            ? b.maxCapacity - a.maxCapacity
            : a.maxCapacity - b.maxCapacity
        default:
          aVal = a.name
          bVal = b.name
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
    const total = filteredClasses.length
    const pages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedClasses = filteredClasses.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedClasses,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      message: 'Classes retrieved successfully'
    })

  } catch (error) {
    console.error('Get classes error:', error)
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

// POST /api/classes - Create new class
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

    const classData = await request.json()

    // Validate required fields
    const errors: Record<string, string[]> = {}
    
    if (!classData.name?.trim()) {
      errors.name = ['Class name is required']
    }
    
    if (!classData.level?.trim()) {
      errors.level = ['Grade level is required']
    }
    
    if (!classData.section?.trim()) {
      errors.section = ['Section is required']
    }
    
    if (!classData.academicYear?.trim()) {
      errors.academicYear = ['Academic year is required']
    }

    if (!classData.maxCapacity || classData.maxCapacity < 1) {
      errors.maxCapacity = ['Maximum capacity must be at least 1']
    }

    // Check if class name already exists for the academic year
    const existingClass = MOCK_CLASSES.find(c => 
      c.name.toLowerCase() === classData.name.toLowerCase() && 
      c.academicYear === classData.academicYear
    )
    if (existingClass) {
      errors.name = ['A class with this name already exists for this academic year']
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

    // Create new class
    const newClass: Class = {
      id: `class_${Date.now()}`,
      name: classData.name.trim(),
      level: classData.level.trim(),
      section: classData.section.trim(),
      academicYear: classData.academicYear.trim(),
      classTeacher: classData.classTeacher || '',
      classTeacherName: classData.classTeacherName || '',
      subjectTeachers: classData.subjectTeachers || [],
      currentEnrollment: classData.currentEnrollment || 0,
      maxCapacity: classData.maxCapacity,
      subjects: classData.subjects || [],
      schedule: classData.schedule || [],
      classroom: classData.classroom?.trim() || '',
      description: classData.description?.trim() || '',
      isActive: classData.isActive !== false, // Default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    MOCK_CLASSES.push(newClass)

    return NextResponse.json({
      success: true,
      data: newClass,
      message: 'Class created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create class error:', error)
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