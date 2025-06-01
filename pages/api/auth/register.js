import { readAuth, writeAuth, hashPassword } from '../../../lib/auth';
import { requireAdmin } from '../../../lib/requireAdmin';

import JWT_SECRET from '../../../lib/jwtSecret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: 'username, email, and password required' });
    return;
  }
  
  const authData = await readAuth();
  if (authData[username]) {
    res.status(409).json({ error: 'User already exists' });
    return;
  }
  
  const timestamp = new Date().toISOString();
  const passwordHash = hashPassword(password, timestamp);
  
  authData[username] = {
    password: passwordHash,
    email,
    last_modified_date: timestamp
  };
  
  await writeAuth(authData);
  res.status(201).json({ message: 'User registered successfully' });
}
