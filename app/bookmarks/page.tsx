'use client';

import { useState, useEffect } from "react";
import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('BOOKMARKS_TOKEN');
    if (!token) {
      window.location.href = '/login';
    } else {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return null;
  }
  
  return <BookmarksClient />;
}
