import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie =
    request.cookies.get('__session')?.value ||
    request.cookies.get('firebase-token')?.value

  const isProtected =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')

  if (isProtected && !sessionCookie) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  const response = NextResponse.next()
  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  }
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
