import Link from 'next/link';
import React from 'react';

export default function Navigation() {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API call failed:', err);
    }
    localStorage.removeItem("BOOKMARKS_TOKEN");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/bookmarks">Bookmarks</Link>
        </li>
        <li>
          <Link href="/notes">Notes</Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li className="ml-auto">
          <button onClick={handleLogout} className="text-white cursor-pointer">Logout</button>
        </li>
      </ul>
    </nav>
  );
}
