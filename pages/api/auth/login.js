import { readAuth, hashPassword } from '../../../lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }
  
  const authData = await readAuth();
  const userData = authData[username];
  if (!userData) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  
  // Log email and last_modified_date for debugging
  console.error('Login attempt:', {
    username,
    email: userData.email,
    last_modified_date: userData.last_modified_date
  });
  process.stdout.write(''); // Force flush of logs

  const hashedInput = hashPassword(password, userData.last_modified_date);
  if (hashedInput !== userData.password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.status(200).json({ token });
}
