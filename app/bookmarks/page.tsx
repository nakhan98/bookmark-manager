'use client';

import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookmarksClient from "./BookmarksClient";
import { requireAuth } from '../../lib/clientAuth';

export default function BookmarksPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useLayoutEffect(() => {
    // This will redirect if not authenticated
    if (requireAuth()) {
      setIsAuthorized(true);
    }
  }, [router]);
  
  // Don't render anything until we've confirmed authorization
  if (!isAuthorized) {
    return null;
  }
  
  return <BookmarksClient />;
}
