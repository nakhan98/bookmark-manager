export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // For stateless JWT, logout is typically handled client-side.
  // Optionally, you could perform server-side cleanup if needed.
  res.status(200).json({ message: 'User logged out successfully' });
}
