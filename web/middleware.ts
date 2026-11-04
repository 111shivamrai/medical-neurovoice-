import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebase-token')?.value

  // Protect /dashboard and /admin routes
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!token && !request.nextUrl.searchParams.has('demo')) {
      const signInUrl = new URL('/signin', request.url)
      signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  const response = NextResponse.next()

  // Apply strict no-store headers on protected dashboard & admin pages
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
