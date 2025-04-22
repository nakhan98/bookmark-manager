import BookmarksClient from "./BookmarksClient";
import { Suspense } from "react";

export default function BookmarksPage() {
  return (
    <Suspense fallback={null}>
      <BookmarksClient />
    </Suspense>
  );
}
