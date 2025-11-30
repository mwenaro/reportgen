import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { 
  isPublicRoute, 
  isAuthRoute, 
  isProtectedRoute, 
  isAdminRoute,
  defaultAuthConfig 
} from './server'
import { UserRole } from './config'

// ============================================================================
// AUTH MIDDLEWARE
// ============================================================================

export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Handle auth routes
  if (isAuthRoute(pathname)) {
    // If already authenticated, redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Require authentication for protected routes
  if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check if user is active
    if (!token.isActive) {
      return NextResponse.redirect(new URL('/auth/account-disabled', req.url))
    }

    // For admin routes, check admin role
    if (isAdminRoute(pathname)) {
      const isAdmin = token.roles?.some((role: any) => 
        [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.DEPUTY_ADMIN].includes(role.role)
      )

      if (!isAdmin) {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
      }
    }

    // Check if user has selected a school (unless super admin)
    const isSuperAdmin = token.roles?.some((role: any) => role.role === UserRole.SUPER_ADMIN)
    if (!isSuperAdmin && !token.currentSchool && !pathname.startsWith('/auth/select-school')) {
      return NextResponse.redirect(new URL('/auth/select-school', req.url))
    }
  }

  return NextResponse.next()
}

// ============================================================================
// TENANT MIDDLEWARE
// ============================================================================

export async function tenantMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host') || ''
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0]
  
  // Skip tenant resolution for main domain, localhost, and IP addresses
  const skipTenantResolution = 
    hostname === process.env.NEXT_PUBLIC_DOMAIN ||
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('192.168') ||
    /^\d+\.\d+\.\d+\.\d+/.test(hostname)

  if (skipTenantResolution) {
    return NextResponse.next()
  }

  // Set tenant header for the application to use
  const response = NextResponse.next()
  response.headers.set('x-tenant-subdomain', subdomain)
  
  return response
}

// ============================================================================
// COMBINED MIDDLEWARE
// ============================================================================

export async function middleware(req: NextRequest) {
  // Apply tenant middleware first
  const tenantResponse = await tenantMiddleware(req)
  if (tenantResponse.status !== 200) {
    return tenantResponse
  }

  // Then apply auth middleware
  return await authMiddleware(req)
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health check endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico|public/).*)',
  ]
}

// ============================================================================
// API ROUTE MIDDLEWARE HELPERS
// ============================================================================

export async function withAuth(
  handler: (req: NextRequest, token: any) => Promise<NextResponse>
) {
  return async function(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.isActive) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    return handler(req, token)
  }
}

export async function withRole(
  roles: UserRole | UserRole[],
  handler: (req: NextRequest, token: any) => Promise<NextResponse>
) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  return async function(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.isActive) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const userRole = token.currentSchool?.role || token.roles?.[0]?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      )
    }

    return handler(req, token)
  }
}

export async function withPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete',
  handler: (req: NextRequest, token: any) => Promise<NextResponse>
) {
  return async function(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.isActive) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const permissions = token.currentSchool?.permissions || []
    const hasPermission = permissions.some((p: string) => {
      const [permResource, actions] = p.split(':')
      return permResource === resource && actions.includes(action)
    })

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      )
    }

    return handler(req, token)
  }
}

export async function withTenant(
  handler: (req: NextRequest, token: any, tenantId: string) => Promise<NextResponse>
) {
  return async function(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const tenantId = req.headers.get('x-tenant-subdomain')

    if (!token || !token.isActive) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant context required' }, 
        { status: 400 }
      )
    }

    // Verify user has access to this tenant
    const hasAccess = token.roles?.some((role: any) => 
      role.schoolId === tenantId && role.isActive
    )

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'No access to this tenant' }, 
        { status: 403 }
      )
    }

    return handler(req, token, tenantId)
  }
}