'use client';

import { useEffect, useState } from 'react';

// Check authentication before component renders
const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('BOOKMARKS_TOKEN');
    if (!token) {
      window.location.replace('/login');
      return false;
    }
    return true;
  }
  return false;
};

// Immediately check auth before component renders
const isAuthenticated = typeof window !== 'undefined' && checkAuth();

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticated);
  
  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-6">
        Manage your bookmarks, notes, calendar, photos and files seamlessly in one place.
      </p>
      <p className="mb-4">You are currently logged in. Use the navigation bar to access your content.</p>
    </div>
  );
}
