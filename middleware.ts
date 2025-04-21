import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for the following paths:
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico')
  ) {
    return NextResponse.next();
  }
  
  // Protect all other routes (including root path)
  const token = request.cookies.get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    console.log(`No token found, redirecting from ${pathname} to /login`);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Make sure the matcher includes the root path
export const config = {
  matcher: ['/', '/:path*'],
};
