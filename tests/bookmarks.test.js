import fs from 'fs/promises';
import path from 'path';
import { readBookmarks, writeBookmarks } from '../lib/bookmarks';

const tempFile = path.join(__dirname, 'temp_bookmarks.json');

afterEach(async () => {
  try {
    await fs.unlink(tempFile);
  } catch (error) {
    // ignore if file doesn't exist
  }
});

test('readBookmarks returns empty array if file does not exist', async () => {
  const bookmarks = await readBookmarks(tempFile);
  expect(bookmarks).toEqual([]);
});

test('writeBookmarks writes bookmarks array and readBookmarks reads it back', async () => {
  const sampleBookmarks = [
    { id: "1", title: "test", url: "http://example.com", note: "" }
  ];
  await writeBookmarks(sampleBookmarks, tempFile);
  const readData = await readBookmarks(tempFile);
  expect(readData).toEqual(sampleBookmarks);
});
