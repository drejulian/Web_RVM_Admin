import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware - Path:', pathname, 'Has token:', !!token)

  // Public routes yang tidak perlu authentication
  const publicPaths = ['/login', '/api/auth/login']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Redirect root ke dashboard atau login
  if (pathname === '/') {
    if (token && await verifyToken(token)) {
      console.log('Redirecting / to /dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    console.log('Redirecting / to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika tidak ada token dan bukan public path
  if (!token && !isPublicPath) {
    console.log('No token for path:', pathname)
    
    // API routes return 401, pages redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('Redirecting to /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika ada token, verify
  if (token) {
    const payload = await verifyToken(token)
    console.log('Token verification result:', !!payload)
    
    // Jika token invalid dan bukan public path
    if (!payload && !isPublicPath) {
      console.log('Invalid token for path:', pathname)
      
      // API routes return 401, pages redirect to login
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }

    // Jika sudah login dan akses login page, redirect ke dashboard
    if (payload && pathname === '/login') {
      console.log('Already logged in, redirecting to /dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  console.log('Allowing request to proceed')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/api/dashboard/:path*',
    '/api/users/:path*',
    '/api/devices/:path*',
    '/api/locations/:path*',
    '/api/transactions/:path*',
    '/api/auth/me',
    '/api/auth/logout',
  ],
}
