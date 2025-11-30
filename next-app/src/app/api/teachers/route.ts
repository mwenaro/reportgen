import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { withErrorHandler, validateRequestBody, validateQueryParams } from '@/lib/api/middleware'
import { teacherCreateSchema, teacherQuerySchema } from '@/lib/validations/api'
import { connectDB } from '@/lib/db'
import TeacherModel from '@/lib/models/teacher.model'
import mongoose from 'mongoose'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'

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
export const GET = withErrorHandler(async (request: NextRequest) => {
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

    // Connect to database
    await connectDB()

    const { searchParams } = new URL(request.url)
    
    // Validate query parameters
    const {
      page,
      limit,
      search,
      status,
      department,
      sortBy,
      sortOrder
    } = validateQueryParams(teacherQuerySchema, searchParams)

    // Build MongoDB query
    let query: any = { isDeleted: false }

    // Add school filter (for multi-tenant support)
    const schoolId = (user as any).schoolId || new mongoose.Types.ObjectId()
    query.schoolId = schoolId

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeNumber: { $regex: search, $options: 'i' } }
      ]
    }

    if (status) {
      query.status = status
    }

    if (department) {
      query.department = department
    }

    // Build sort object
    const sortObj: any = {}
    switch (sortBy) {
      case 'firstName':
        sortObj.firstName = sortOrder === 'desc' ? -1 : 1
        break
      case 'lastName':
        sortObj.lastName = sortOrder === 'desc' ? -1 : 1
        break
      case 'email':
        sortObj.email = sortOrder === 'desc' ? -1 : 1
        break
      case 'joiningDate':
        sortObj.dateOfJoining = sortOrder === 'desc' ? -1 : 1
        break
      case 'department':
        sortObj.department = sortOrder === 'desc' ? -1 : 1
        break
      default:
        sortObj.lastName = 1
    }

    // Execute query with pagination
    const [teachers, total] = await Promise.all([
      TeacherModel.find(query)
        .select('-salary -documents -notes -performanceRecords') // Exclude sensitive fields
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('subjectAssignments.subjectId', 'name code')
        .populate('classAssignments.classId', 'name level')
        .lean(),
      TeacherModel.countDocuments(query)
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: teachers,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      message: 'Teachers retrieved successfully'
    })

})

// POST /api/teachers - Create new teacher
export const POST = withErrorHandler(async (request: NextRequest) => {
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

    // Connect to database
    await connectDB()

    const requestBody = await request.json()
    
    // Validate request body
    const teacherData = validateRequestBody(teacherCreateSchema, requestBody)
    
    // Get school ID from user
    const schoolId = (user as any).schoolId || new mongoose.Types.ObjectId()
    const userId = (user as any).id || (user as any)._id

    // Check for duplicate email
    const existingEmailTeacher = await TeacherModel.findOne({ 
      email: teacherData.email.toLowerCase(),
      isDeleted: false 
    })
    
    if (existingEmailTeacher) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email already exists',
          errors: { email: ['This email is already in use'] }
        },
        { status: 409 }
      )
    }

    // Check for duplicate employee number in same school
    if (teacherData.employeeId) {
      const existingEmployeeTeacher = await TeacherModel.findOne({ 
        schoolId,
        employeeNumber: teacherData.employeeId.toUpperCase(),
        isDeleted: false 
      })
      
      if (existingEmployeeTeacher) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Employee ID already exists',
            errors: { employeeId: ['This employee ID is already in use'] }
          },
          { status: 409 }
        )
      }
    }

    // Prepare teacher data for MongoDB
    const teacherDoc = {
      schoolId,
      employeeNumber: teacherData.employeeId?.trim().toUpperCase() || `EMP${Date.now()}`,
      firstName: teacherData.firstName.trim(),
      lastName: teacherData.lastName.trim(),
      email: teacherData.email.trim().toLowerCase(),
      phone: teacherData.phone?.trim(),
      dateOfBirth: teacherData.dateOfBirth ? new Date(teacherData.dateOfBirth) : undefined,
      gender: teacherData.gender,
      
      // Address (simplified for compatibility)
      address: teacherData.address ? {
        street: teacherData.address,
        city: 'Unknown',
        state: 'Unknown', 
        country: 'Kenya',
        postalCode: '00000'
      } : undefined,
      
      // Professional Information
      qualifications: teacherData.qualification ? [{
        degree: 'other' as const,
        field: teacherData.qualification,
        institution: 'Unknown',
        yearCompleted: new Date().getFullYear(),
        verified: false
      }] : undefined,
      
      specializations: teacherData.specialization ? [teacherData.specialization.toLowerCase()] : [],
      
      // Employment Details
      employmentType: (teacherData.contractType === 'part-time') ? 'temporary' : 
                      (teacherData.contractType === 'contract') ? 'contract' : 'permanent',
      dateOfJoining: teacherData.joiningDate ? new Date(teacherData.joiningDate) : new Date(),
      status: teacherData.status || 'active',
      department: teacherData.department,
      
      // Emergency Contact
      emergencyContact: teacherData.emergencyContact ? {
        name: teacherData.emergencyContact.name,
        relationship: teacherData.emergencyContact.relationship,
        phone: teacherData.emergencyContact.phone
      } : undefined,
      
      // Salary (basic structure)
      salary: teacherData.salary ? {
        basic: teacherData.salary,
        allowances: [],
        deductions: [],
        currency: 'KES'
      } : undefined,
      
      // Performance
      performanceSummary: teacherData.performanceRating ? {
        currentRating: teacherData.performanceRating,
        lastEvaluated: teacherData.lastReviewDate ? new Date(teacherData.lastReviewDate) : undefined
      } : undefined,
      
      // System fields
      createdBy: new mongoose.Types.ObjectId(userId),
      status: teacherData.status || 'active'
    }

    // Create new teacher
    const newTeacher = new TeacherModel(teacherDoc)
    await newTeacher.save()

    // Return created teacher (excluding sensitive fields)
    const createdTeacher = await TeacherModel.findById(newTeacher._id)
      .select('-salary -documents -notes -performanceRecords')
      .lean()

    return NextResponse.json({
      success: true,
      data: createdTeacher,
      message: 'Teacher created successfully'
    }, { status: 201 })

})