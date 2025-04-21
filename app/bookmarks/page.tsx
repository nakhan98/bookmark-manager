import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {
  const token = cookies().get("BOOKMARKS_TOKEN")?.value;
  if (!token) {
    redirect("/login");
  }
  return <BookmarksClient />;
}
