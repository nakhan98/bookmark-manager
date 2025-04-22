'use client';

import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('BOOKMARKS_TOKEN');
    if (!token) {
      window.location.href = '/login';
      return null;
    }
  }
  
  return <BookmarksClient />;
}
