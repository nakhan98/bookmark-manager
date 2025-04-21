import Link from 'next/link';
import React from 'react';

export default function Navigation() {
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
          <button onClick={() => { localStorage.removeItem("BOOKMARKS_TOKEN"); window.location.href = "/login"; }} className="text-white">Logout</button>
        </li>
      </ul>
    </nav>
  );
}
