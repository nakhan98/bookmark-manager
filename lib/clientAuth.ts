// Client-side authentication utilities


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
