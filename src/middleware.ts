import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/reset-password']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Auth routes that should redirect if user is already logged in
  const authRoutes = ['/login', '/signup', '/reset-password']
  const isAuthRoute = authRoutes.includes(pathname)

  // Protected routes that require authentication
  const protectedRoutes = ['/student', '/section-admin', '/super-admin', '/tasks']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to appropriate dashboard
  if (user && isAuthRoute) {
    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData) {
      const role = userData.role
      let redirectPath = '/student' // default

      if (role === 'super_admin') {
        redirectPath = '/super-admin'
      } else if (role === 'section_admin') {
        redirectPath = '/section-admin'
      }

      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // Role-based route protection
  if (user && isProtectedRoute) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData) {
      const role = userData.role

      // Super admin can access all routes
      if (role === 'super_admin') {
        return response
      }

      // Section admin restrictions
      if (role === 'section_admin') {
        if (pathname.startsWith('/super-admin')) {
          return NextResponse.redirect(new URL('/section-admin', request.url))
        }
        return response
      }

      // Regular user restrictions
      if (role === 'user') {
        if (pathname.startsWith('/section-admin') || pathname.startsWith('/super-admin')) {
          return NextResponse.redirect(new URL('/student', request.url))
        }
        return response
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
