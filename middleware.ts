import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only allow access to these paths without authentication
  const publicPaths = [
    '/login',
    '/_next',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/favicon.ico',
    '/static'
  ];
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = request.cookies.get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    // If it's an API request, return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }
    
    // For non-API routes, immediately redirect to login to prevent any flash of protected content.
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Make sure the matcher includes all paths
export const config = {
  matcher: [
    '/',
    '/bookmarks',
    '/bookmarks/:path*',
    '/notes',
    '/notes/:path*',
    '/calendar',
    '/calendar/:path*',
    '/profile',
    '/profile/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|login).*)' // Catch all other routes except excluded ones
  ],
};
