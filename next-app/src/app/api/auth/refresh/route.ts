import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default-refresh-secret'

// Mock user data - same as in auth/route.ts
const MOCK_USERS = [
  {
    id: 'user_1',
    email: 'admin@school.edu',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin']
  },
  {
    id: 'user_2',
    email: 'teacher@school.edu',
    firstName: 'John',
    lastName: 'Teacher',
    role: 'teacher',
    permissions: ['read', 'write']
  }
]

// POST /api/auth/refresh
export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Refresh token required',
          errors: { auth: ['No refresh token provided'] }
        },
        { status: 401 }
      )
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string }
      
      // Find user
      const user = MOCK_USERS.find(u => u.id === decoded.userId)
      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'User not found',
            errors: { auth: ['User associated with token not found'] }
          },
          { status: 401 }
        )
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          permissions: user.permissions
        }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      )

      return NextResponse.json({
        success: true,
        data: {
          accessToken,
          expiresIn: 3600 // 1 hour in seconds
        },
        message: 'Token refreshed successfully'
      })

    } catch (jwtError) {
      // Clear invalid refresh token
      const response = NextResponse.json(
        { 
          success: false, 
          message: 'Invalid refresh token',
          errors: { auth: ['Refresh token is invalid or expired'] }
        },
        { status: 401 }
      )

      response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
      })

      return response
    }

  } catch (error) {
    console.error('Token refresh error:', error)
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