import jwt from 'jsonwebtoken';
import { readAuth } from './auth.js';
import JWT_SECRET from './jwtSecret.js';

export async function requireAdmin(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
  const authData = await readAuth();
  const user = authData[decoded.username];
  if (!user || !user.isAdmin) {
    res.status(403).json({ error: 'Admin privileges required' });
    return null;
  }
  return user;
}
