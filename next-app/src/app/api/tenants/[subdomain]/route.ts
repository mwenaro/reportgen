// API route for getting tenant by subdomain
import { NextRequest, NextResponse } from 'next/server'
import { validateTenant } from '@/lib/tenant-resolver'
import { createApiResponse } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const { subdomain } = params
    
    if (!subdomain) {
      return NextResponse.json(
        createApiResponse(false, null, 'Subdomain is required'),
        { status: 400 }
      )
    }
    
    const tenant = await validateTenant(subdomain)
    
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