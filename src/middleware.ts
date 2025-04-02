import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const publicPaths = [
        '/login',
        "/src/app/Styles/",
        "/src/app/globals.css",
        "/_next",
        "/favicon.ico",
        "/api/auth",
        "/header/hLogo.svg",
        "/auth",
    ];

    const isPublicPath = publicPaths.some(p => path.startsWith(p))
    const token = request.cookies.get('token')?.value

    // If not on a public path and no token, redirect to login
    if (!isPublicPath && !token && path !== "/reset-password") {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If on login page and authenticated, redirect to banner
    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/home/banner', request.url))
    }

    if (path === '/' && token) {
        return NextResponse.redirect(new URL('/home/banner', request.url))
    }

    if (path === '/' && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/:path*']
}