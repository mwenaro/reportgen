// API route for getting tenant by ID
import { NextRequest, NextResponse } from 'next/server'
import { getTenantById } from '@/lib/tenant-resolver'
import { createApiResponse } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        createApiResponse(false, null, 'Tenant ID is required'),
        { status: 400 }
      )
    }
    
    const tenant = await getTenantById(id)
    
    if (!tenant) {
      return NextResponse.json(
        createApiResponse(false, null, 'Tenant not found'),
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      createApiResponse(true, tenant, 'Tenant retrieved successfully')
    )
  } catch (error) {
    console.error('Tenant API error:', error)
    return NextResponse.json(
      createApiResponse(false, null, 'Internal server error'),
      { status: 500 }
    )
  }
}