import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Types for authentication
interface LoginRequest {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
}

// Mock user data - replace with actual database
const MOCK_USERS = [
  {
    id: 'user_1',
    email: 'admin@school.edu',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeHHRb8/.Yb3m3.Oe', // 'admin123'
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin']
  },
  {
    id: 'user_2',
    email: 'teacher@school.edu',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeHHRb8/.Yb3m3.Oe', // 'teacher123'
    firstName: 'John',
    lastName: 'Teacher',
    role: 'teacher',
    permissions: ['read', 'write']
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default-refresh-secret'

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required',
          errors: { 
            email: !email ? ['Email is required'] : [],
            password: !password ? ['Password is required'] : []
          }
        },
        { status: 400 }
      )
    }

    // Find user
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials',
          errors: { auth: ['Invalid email or password'] }
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials',
          errors: { auth: ['Invalid email or password'] }
        },
        { status: 401 }
      )
    }

    // Create user payload (exclude password)
    const userPayload: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      permissions: user.permissions
    }

    // Generate tokens
    const accessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' })

    // Set httpOnly cookie for refresh token
    const response = NextResponse.json({
      success: true,
      data: {
        user: userPayload,
        accessToken,
        expiresIn: 3600 // 1 hour in seconds
      },
      message: 'Login successful'
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
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

// GET /api/auth/me
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required',
          errors: { auth: ['No valid authentication token provided'] }
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as User
      return NextResponse.json({
        success: true,
        data: decoded,
        message: 'User retrieved successfully'
      })
    } catch (jwtError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token',
          errors: { auth: ['Token is invalid or expired'] }
        },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Get user error:', error)
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

// DELETE /api/auth/logout
export async function DELETE(request: NextRequest) {
  try {
    // Clear the refresh token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
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