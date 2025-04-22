'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookmarksClient from "./BookmarksClient";
import { requireAuth, isAuthenticated } from '../../lib/clientAuth';

export default function BookmarksPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(() => isAuthenticated());
  
  useEffect(() => {
    if (!isAuthorized) {
      requireAuth();
    }
  }, [isAuthorized, router]);
  
  // Don't render anything until we've confirmed authorization
  if (!isAuthorized) {
    return null;
  }
  
  return <BookmarksClient />;
}
