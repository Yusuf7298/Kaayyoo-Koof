import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    // Protect all /admin/* routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const sessionCookie =
            request.cookies.get('better-auth.session_token') ||
            request.cookies.get('__Secure-better-auth.session_token')

        if (!sessionCookie) {
            const signInUrl = new URL('/sign-in', request.url)
            signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
            return NextResponse.redirect(signInUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
