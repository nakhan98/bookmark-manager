import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BookmarksClient from "./BookmarksClient";
import { Suspense } from "react";

export default function BookmarksPage() {
  // Server-side authentication check
  const cookieStore = cookies();
  const token = cookieStore.get('BOOKMARKS_TOKEN');
  
  if (!token) {
    redirect('/login');
  }
  
  return (
    <Suspense fallback={null}>
      <BookmarksClient />
    </Suspense>
  );
}
