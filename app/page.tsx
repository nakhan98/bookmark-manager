'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('BOOKMARKS_TOKEN');
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);
  
  // Show nothing during loading
  if (isLoading) {
    return null;
  }
  
  // Only render content if authenticated
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
