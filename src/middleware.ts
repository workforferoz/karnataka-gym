import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/admin-auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // If already logged in, redirect directly to /admin
      const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (token) {
        const { valid } = await verifySessionToken(token);
        if (valid) {
          return NextResponse.redirect(new URL('/admin', req.url));
        }
      }
      return NextResponse.next();
    }

    // Require valid admin session
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { valid } = await verifySessionToken(token);
    if (!valid) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      // Clear invalid cookie
      res.cookies.delete(ADMIN_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
