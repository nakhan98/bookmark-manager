import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BookmarksLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('BOOKMARKS_TOKEN');
  if (!token) {
    redirect('/login');
  }
  return <>{children}</>;
}
