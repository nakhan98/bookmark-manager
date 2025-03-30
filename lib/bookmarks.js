const fs = require('fs').promises;
const path = require('path');

const BOOKMARKS_FILE = path.join(process.cwd(), 'data', 'bookmarks.json');

async function readBookmarks(file = BOOKMARKS_FILE) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBookmarks(bookmarks, file = BOOKMARKS_FILE) {
  await fs.writeFile(file, JSON.stringify(bookmarks, null, 2));
}

module.exports = { BOOKMARKS_FILE, readBookmarks, writeBookmarks };
