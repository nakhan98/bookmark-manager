import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = (await cookies()).get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal Organiser</h1>
      <p className="text-lg mb-2">Manage your bookmarks, notes, calendar, photos and files seamlessly.</p>
      <p className="mb-2">Use the navigation bar above to explore different sections.</p>
      <p>Enjoy a secure and integrated experience for all your organisational needs.</p>
    </div>
  );
}
