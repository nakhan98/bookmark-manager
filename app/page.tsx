'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '../lib/clientAuth';

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // This will redirect if not authenticated
    if (requireAuth()) {
      setIsAuthorized(true);
    }
  }, [router]);
  
  // Don't render anything until we've confirmed authorization
  if (!isAuthorized) {
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
