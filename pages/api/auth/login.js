import { readAuth, hashPassword } from '../../../lib/auth';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export default async function handler(req, res) {
  const logEntry = {
    event: 'function_start',
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  };
  console.log(logEntry);

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
    console.log({
      event: 'login_failed',
      reason: 'user_not_found',
      username,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const hashedInput = hashPassword(password, userData.last_modified_date);
  if (hashedInput !== userData.password) {
    console.log({
      event: 'login_failed',
      reason: 'invalid_password',
      username,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  // Set cookie for 24 hours
  res.setHeader('Set-Cookie', `BOOKMARKS_TOKEN=${token}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`);
  res.status(200).json({ token });
}
