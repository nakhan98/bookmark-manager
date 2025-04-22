import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side authentication check
  const cookieStore = cookies();
  const token = cookieStore.get('BOOKMARKS_TOKEN');
  
  if (!token) {
    redirect('/login');
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
