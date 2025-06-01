import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  // Log all cookies for debugging
  console.log('Server cookies:', cookieStore.getAll());
  const token = cookieStore.get('BOOKMARKS_TOKEN');
  if (!token) {
    redirect('/login');
  }
  return <BookmarksClient />;
}
