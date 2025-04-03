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

async function fetchPageTitle(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (error) {
    console.error('Error fetching page title:', error);
    return null;
  }
}

module.exports = { BOOKMARKS_FILE, readBookmarks, writeBookmarks, fetchPageTitle };
