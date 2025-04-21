import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect all routes under /bookmarks
  if (request.nextUrl.pathname.startsWith('/bookmarks')) {
    const token = request.cookies.get("BOOKMARKS_TOKEN")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/bookmarks/:path*'],
};
