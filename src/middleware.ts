import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const isAuth = !!token;
    let isAdmin = false;

    if (token) {
        try {
            // Decode the JWT payload (the second part of the token)
            // JWT format: header.payload.signature
            const payloadBase64Url = token.split('.')[1];
            // Convert Base64Url to Base64
            const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            isAdmin = payload.role === 'ADMIN';
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    }
    
    // Add pathname to headers so server components can access it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);
    
    // Redirect /login to external webmail
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect('https://webmail.ksamail.com/', 308);
    }

    // For admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to /admin/login
        if (request.nextUrl.pathname === '/admin/login') {
            if (isAdmin) {
                // If already logged in as admin, redirect away from login
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next({
                request: { headers: requestHeaders }
            });
        }

        // Redirect to /admin/login if not authenticated as ADMIN
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next({
        request: { headers: requestHeaders }
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // match all except static
};
