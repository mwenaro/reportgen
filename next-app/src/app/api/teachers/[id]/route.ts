import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
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

    // Connect to database
    await connectDB()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid teacher ID',
          errors: { teacher: ['Please provide a valid teacher ID'] }
        },
        { status: 400 }
      )
    }

    // Get school ID from user for multi-tenant support
    const schoolId = (user as any).schoolId || new mongoose.Types.ObjectId()

    const teacher = await TeacherModel.findOne({ 
      _id: id,
      schoolId,
      isDeleted: false 
    })
    .populate('subjectAssignments.subjectId', 'name code department')
    .populate('classAssignments.classId', 'name level section')
    .select('-documents -notes') // Exclude sensitive fields
    .lean()

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

    // Connect to database
    await connectDB()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid teacher ID',
          errors: { teacher: ['Please provide a valid teacher ID'] }
        },
        { status: 400 }
      )
    }

    // Get school ID from user for multi-tenant support
    const schoolId = (user as any).schoolId || new mongoose.Types.ObjectId()
    const userId = (user as any).id || (user as any)._id

    // Check if teacher exists
    const existingTeacher = await TeacherModel.findOne({ 
      _id: id,
      schoolId,
      isDeleted: false 
    })

    if (!existingTeacher) {
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
          // Check for duplicate email (excluding current teacher)
          const existingEmailTeacher = await TeacherModel.findOne({
            email: updateData.email.toLowerCase(),
            _id: { $ne: id },
            isDeleted: false
          })
          if (existingEmailTeacher) {
            errors.email = ['This email is already in use']
          }
        }
      }
    }

    if (updateData.employeeId !== undefined && updateData.employeeId) {
      // Check for duplicate employee number in same school (excluding current teacher)
      const existingEmployeeTeacher = await TeacherModel.findOne({
        schoolId,
        employeeNumber: updateData.employeeId.toUpperCase(),
        _id: { $ne: id },
        isDeleted: false
      })
      if (existingEmployeeTeacher) {
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

    // Prepare update data for MongoDB
    const mongoUpdateData: any = {
      updatedBy: new mongoose.Types.ObjectId(userId)
    }

    // Map fields to MongoDB schema
    if (updateData.firstName) mongoUpdateData.firstName = updateData.firstName.trim()
    if (updateData.lastName) mongoUpdateData.lastName = updateData.lastName.trim()
    if (updateData.email) mongoUpdateData.email = updateData.email.trim().toLowerCase()
    if (updateData.phone) mongoUpdateData.phone = updateData.phone.trim()
    if (updateData.dateOfBirth) mongoUpdateData.dateOfBirth = new Date(updateData.dateOfBirth)
    if (updateData.gender) mongoUpdateData.gender = updateData.gender
    if (updateData.employeeId) mongoUpdateData.employeeNumber = updateData.employeeId.trim().toUpperCase()
    if (updateData.department) mongoUpdateData.department = updateData.department.trim()
    if (updateData.status) mongoUpdateData.status = updateData.status

    // Update address if provided
    if (updateData.address) {
      mongoUpdateData.address = {
        street: updateData.address,
        city: 'Unknown',
        state: 'Unknown',
        country: 'Kenya',
        postalCode: '00000'
      }
    }

    // Update emergency contact if provided
    if (updateData.emergencyContact) {
      mongoUpdateData.emergencyContact = updateData.emergencyContact
    }

    // Update qualifications if provided
    if (updateData.qualification) {
      mongoUpdateData.qualifications = [{
        degree: 'other' as const,
        field: updateData.qualification,
        institution: 'Unknown',
        yearCompleted: new Date().getFullYear(),
        verified: false
      }]
    }

    // Update teacher
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      mongoUpdateData,
      { new: true, runValidators: true }
    )
    .select('-salary -documents -notes -performanceRecords')
    .populate('subjectAssignments.subjectId', 'name code')
    .populate('classAssignments.classId', 'name level')
    .lean()

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

// DELETE /api/teachers/[id] - Delete teacher (soft delete)
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

    // Connect to database
    await connectDB()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid teacher ID',
          errors: { teacher: ['Please provide a valid teacher ID'] }
        },
        { status: 400 }
      )
    }

    // Get school ID from user for multi-tenant support
    const schoolId = (user as any).schoolId || new mongoose.Types.ObjectId()
    const userId = (user as any).id || (user as any)._id

    // Check if teacher exists
    const existingTeacher = await TeacherModel.findOne({ 
      _id: id,
      schoolId,
      isDeleted: false 
    })

    if (!existingTeacher) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Teacher not found',
          errors: { teacher: ['No teacher found with the provided ID'] }
        },
        { status: 404 }
      )
    }

    // Soft delete teacher
    const deletedTeacher = await TeacherModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: new mongoose.Types.ObjectId(userId),
        status: 'inactive'
      },
      { new: true }
    )
    .select('-salary -documents -notes -performanceRecords')
    .lean()

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