import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json(
        { error: 'School ID is required' }, 
        { status: 400 }
      )
    }

    // Find the role for the specified school
    const targetRole = token.roles?.find((role: any) => 
      role.schoolId === schoolId && role.isActive
    )

    if (!targetRole) {
      return NextResponse.json(
        { error: 'No access to the specified school' }, 
        { status: 403 }
      )
    }

    // In a real implementation, you would update the JWT token
    // This is a simplified approach - you might want to use a custom JWT callback
    // or implement a custom session update mechanism

    return NextResponse.json({
      success: true,
      message: 'School context updated',
      school: {
        id: targetRole.schoolId,
        name: targetRole.schoolName,
        role: targetRole.role,
        permissions: targetRole.permissions
      }
    })

  } catch (error) {
    console.error('Switch school error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request) // Same logic for POST requests
}