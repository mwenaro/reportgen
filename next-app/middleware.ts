import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies or local storage (since we can't access localStorage in middleware)
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '')

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login']
  
  // API routes that don't require authentication
  const publicApiRoutes = ['/api/auth/login', '/api/health']

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')

  // Handle API routes
  if (isApiRoute) {
    if (isPublicApiRoute) {
      return NextResponse.next()
    }
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.next()
  }

  // Handle dashboard routes - require authentication
  if (pathname.startsWith('/dashboard')) {
    
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (pathname.startsWith('/login')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Handle root route
  if (pathname === '/') {
    // Could redirect to dashboard if authenticated, or show landing page
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}