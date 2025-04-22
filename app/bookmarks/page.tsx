import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BookmarksClient from "./BookmarksClient";

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('BOOKMARKS_TOKEN');
  if (!token) {
    redirect('/login');
  }
  return <BookmarksClient />;
}
