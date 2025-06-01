import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BookmarksLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  // Log all cookies for debugging
  console.log('Server cookies (layout):', cookieStore.getAll());
  const token = cookieStore.get('BOOKMARKS_TOKEN');
  if (!token) {
    redirect('/login');
  }
  return <>{children}</>;
}
