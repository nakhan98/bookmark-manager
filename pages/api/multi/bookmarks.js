import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
console.log('DEBUG: cookie import:', cookie);
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

async function getUserBookmarks(username) {
  const filePath = path.join(process.cwd(), 'data', 'bookmarks', `${username}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUserBookmarks(username, bookmarks) {
  const dir = path.join(process.cwd(), 'data', 'bookmarks');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${username}.json`);
  await fs.writeFile(filePath, JSON.stringify(bookmarks, null, 2));
}

export default async function handler(req, res) {
  // Authenticate user manually using JWT
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(' ')[1];
  } else if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.BOOKMARKS_TOKEN;
  }
  if (!token) {
    res.status(401).json({ error: 'Authorization header or cookie missing' });
    return;
  }
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const username = decoded.username;

  if (req.method === 'GET') {
    const bookmarks = await getUserBookmarks(username);
    res.status(200).json(bookmarks);
    return;
  } else if (req.method === 'POST') {
    const { url, title, description } = req.body;
    if (!url || !title) {
      res.status(400).json({ error: 'url and title required' });
      return;
    }
    const newBookmark = {
      id: Date.now().toString(),
      userId: username,
      url,
      title,
      description: description || "",
      createdAt: new Date().toISOString()
    };
    const bookmarks = await getUserBookmarks(username);
    bookmarks.push(newBookmark);
    await saveUserBookmarks(username, bookmarks);
    res.status(201).json(newBookmark);
    return;
  } else if (req.method.toUpperCase() === 'PUT') {
    const { id, url, title, description } = req.body;
    if (!id || (!url && !title && description === undefined)) {
      res.status(400).json({ error: 'bookmark id and at least one of url, title, or description required' });
      return;
    }
    let bookmarks = await getUserBookmarks(username);
    let bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }
    if (url) bookmark.url = url;
    if (title) bookmark.title = title;
    if (description !== undefined) bookmark.description = description;
    bookmark.updatedAt = new Date().toISOString();
    await saveUserBookmarks(username, bookmarks);
    res.status(200).json(bookmark);
    return;
  } else if (req.method.toUpperCase() === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: 'bookmark id required' });
      return;
    }
    let bookmarks = await getUserBookmarks(username);
    const newBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    await saveUserBookmarks(username, newBookmarks);
    res.status(200).json({ message: 'Bookmark deleted successfully' });
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
}
