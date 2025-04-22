// Client-side authentication utilities

/**
 * Synchronously check if user is authenticated based on localStorage
 * This is used for initial render decisions
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('BOOKMARKS_TOKEN');
  return !!token;
}

/**
 * Redirect to login page if not authenticated
 * Returns true if authenticated, false if redirecting
 */
export function requireAuth(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('BOOKMARKS_TOKEN');
  if (!token) {
    window.location.href = '/login';
    return false;
  }
  
  return true;
}
