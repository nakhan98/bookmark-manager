'use client';

import { useState, useLayoutEffect } from "react";
import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useLayoutEffect(() => {
    const token = localStorage.getItem('BOOKMARKS_TOKEN');
    if (!token) {
      // Hide the navbar immediately if present
      const navbar = document.querySelector('nav.bg-gray-800');
      if (navbar) {
        navbar.style.display = 'none';
      }
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
