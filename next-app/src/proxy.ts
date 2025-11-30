// Enhanced tenant resolution and authentication proxy
// Next.js 16+ proxy file convention
import { NextRequest, NextResponse } from 'next/server'
import { extractSubdomain, validateTenant, isMainDomain } from './lib/tenant-resolver'

export default async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Extract subdomain from hostname
  const subdomain = extractSubdomain(hostname)
  
  // If no subdomain, redirect to main marketing site
  if (isMainDomain(hostname)) {
    // Allow marketing routes
    if (url.pathname.startsWith('/(marketing)') || url.pathname === '/') {
      return NextResponse.next()
    }
    
    // Redirect other routes to marketing
    url.pathname = '/(marketing)'
    return NextResponse.redirect(url)
  }
  
  // If subdomain exists, validate tenant
  if (subdomain) {
    try {
      const tenant = await validateTenant(subdomain)
      
      if (!tenant) {
        // Invalid tenant - redirect to main site with error
        const mainUrl = new URL('/', `http://${hostname.replace(`${subdomain}.`, '')}`)
        mainUrl.searchParams.set('error', 'tenant_not_found')
        return NextResponse.redirect(mainUrl)
      }
      
      if (tenant.status !== 'active') {
        // Suspended tenant
        const mainUrl = new URL('/', `http://${hostname.replace(`${subdomain}.`, '')}`)
        mainUrl.searchParams.set('error', 'tenant_suspended')
        return NextResponse.redirect(mainUrl)
      }
      
      // Set tenant context in headers for API routes and pages
      const response = NextResponse.next()
      response.headers.set('x-tenant-id', tenant.id)
      response.headers.set('x-tenant-subdomain', tenant.subdomain)
      response.headers.set('x-tenant-name', tenant.name)
      response.headers.set('x-tenant-features', JSON.stringify(tenant.settings.features))
      
      // Rewrite to tenant-specific routes if needed
      if (url.pathname === '/') {
        url.pathname = '/(tenant)/[subdomain]'
        return NextResponse.rewrite(url)
      }
      
      return response
      
    } catch (error) {
      console.error('Tenant validation error:', error)
      
      // On error, redirect to main site
      const mainUrl = new URL('/', `http://${hostname.replace(`${subdomain}.`, '')}`)
      mainUrl.searchParams.set('error', 'server_error')
      return NextResponse.redirect(mainUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}