import { readAuth, writeAuth, hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    res.status(400).json({ error: 'username, oldPassword, and newPassword required' });
    return;
  }
  
  const authData = await readAuth();
  const userData = authData[username];
  if (!userData) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }
  
  const hashedOld = hashPassword(oldPassword, userData.last_modified_date);
  if (hashedOld !== userData.password) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }
  
  const timestamp = new Date().toISOString();
  const newHash = hashPassword(newPassword, timestamp);
  authData[username].password = newHash;
  authData[username].last_modified_date = timestamp;
  
  await writeAuth(authData);
  res.status(200).json({ message: 'Password reset successfully' });
}
