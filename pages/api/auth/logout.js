export default async function handler(req, res) {
  console.log({
    event: 'logout_attempt',
    method: req.method,
    cookies: req.headers.cookie,
    timestamp: new Date().toISOString()
  });

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Clear the cookie by setting it to expire immediately
  res.setHeader('Set-Cookie', 'BOOKMARKS_TOKEN=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  console.log({
    event: 'logout_success',
    timestamp: new Date().toISOString()
  });
  res.status(200).json({ message: 'User logged out successfully' });
}
