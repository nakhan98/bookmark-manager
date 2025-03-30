import { promises as fs } from 'fs';
import path from 'path';

export const BOOKMARKS_FILE = path.join(process.cwd(), 'data', 'bookmarks.json');

export async function readBookmarks(file = BOOKMARKS_FILE) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function writeBookmarks(bookmarks, file = BOOKMARKS_FILE) {
  await fs.writeFile(file, JSON.stringify(bookmarks, null, 2));
}
