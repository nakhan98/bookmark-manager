import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-6">
        Manage your bookmarks, notes, calendar, photos and files seamlessly in one place.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="btn btn-primary">
          Login
        </Link>
        <Link href="/bookmarks" className="btn btn-secondary">
          Go to Bookmarks
        </Link>
      </div>
    </div>
  );
}
