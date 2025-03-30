import { promises as fs } from 'fs';
import path from 'path';

const BOOKMARKS_FILE = path.join(process.cwd(), 'data', 'bookmarks.json');

async function readBookmarks() {
  try {
    const data = await fs.readFile(BOOKMARKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBookmarks(bookmarks) {
  await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const bookmarks = await readBookmarks();
    res.status(200).json(bookmarks);
    return;
  } else if (req.method === 'POST') {
    const { title, url, note } = req.body;
    if (!title || !url) {
      res.status(400).json({ error: 'Title and URL required' });
      return;
    }
    const bookmarks = await readBookmarks();
    // Check for duplicate URL
    if (bookmarks.find(b => b.url === url)) {
      res.status(400).json({ error: 'Bookmark with the same URL already exists' });
      return;
    }
    const newBookmark = {
      id: Date.now().toString(),
      title,
      url,
      note: note || '',
      creationDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    bookmarks.push(newBookmark);
    await writeBookmarks(bookmarks);
    res.status(201).json(newBookmark);
    return;
  } else if (req.method === 'PUT') {
    const { id, title, url, note } = req.body;
    if (!id || !title || !url) {
      res.status(400).json({ error: 'ID, title and URL required' });
      return;
    }
    const bookmarks = await readBookmarks();
    const index = bookmarks.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Bookmark not found' });
      return;
    }
    // Check for duplicate URL when changing URL
    if (bookmarks.find(b => b.url === url && b.id !== id)) {
      res.status(400).json({ error: 'Another bookmark with the same URL already exists' });
      return;
    }
    bookmarks[index] = {
      ...bookmarks[index],
      title,
      url,
      note: note || '',
      modifiedDate: new Date().toISOString()
    };
    await writeBookmarks(bookmarks);
    res.status(200).json(bookmarks[index]);
    return;
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: 'ID required' });
      return;
    }
    let bookmarks = await readBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== id);
    await writeBookmarks(bookmarks);
    res.status(200).json({ message: 'Bookmark deleted' });
    return;
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
