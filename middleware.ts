import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for the following paths:
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico') ||
    pathname.includes('static')
  ) {
    return NextResponse.next();
  }
  
  // Protect all other routes (including root path)
  const token = request.cookies.get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    // Use a 307 temporary redirect to ensure the browser follows the redirect immediately
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    
    // Add cache control headers to prevent caching of the redirect
    const response = NextResponse.redirect(url, 307);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  }
  
  return NextResponse.next();
}

// Make sure the matcher includes the root path
export const config = {
  matcher: ['/', '/:path*'],
};
