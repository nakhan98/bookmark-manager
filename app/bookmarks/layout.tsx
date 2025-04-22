export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally excludes the global navigation,
  // preventing any flash of protected content.
  return <>{children}</>;
}
