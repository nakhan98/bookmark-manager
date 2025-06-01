export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Clear the cookie by setting it to expire immediately
  res.setHeader('Set-Cookie', 'BOOKMARKS_TOKEN=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  res.status(200).json({ message: 'User logged out successfully' });
}
