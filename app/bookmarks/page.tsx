import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookmarksClient from "./BookmarksClient";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BookmarksPage() {
  const token = (await cookies()).get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    redirect("/login");
  }
  return <BookmarksClient />;
}
