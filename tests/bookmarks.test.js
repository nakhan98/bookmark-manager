const fs = require('fs/promises');
const path = require('path');
const { readBookmarks, writeBookmarks } = require('../lib/bookmarks');

const tempFile = path.join(__dirname, 'temp_bookmarks.json');

afterEach(async () => {
  try {
    await fs.unlink(tempFile);
  } catch (error) {
    // ignore if file doesn't exist
  }
});
test('editing bookmark updates the bookmark correctly', async () => {
  const initialBookmarks = [
    { id: "1", title: "Original", url: "http://original.com", note: "note" },
    { id: "2", title: "Second", url: "http://second.com", note: "second note" }
  ];
  await writeBookmarks(initialBookmarks, tempFile);
  const bookmarks = await readBookmarks(tempFile);
  const editedBookmarks = bookmarks.map(b =>
    b.id === "1" ? { ...b, title: "Edited", url: "http://edited.com" } : b
  );
  await writeBookmarks(editedBookmarks, tempFile);
  const readAfterEdit = await readBookmarks(tempFile);
  expect(readAfterEdit.find(b => b.id === "1").title).toEqual("Edited");
  expect(readAfterEdit.find(b => b.id === "1").url).toEqual("http://edited.com");
});

test('deleting bookmark removes the bookmark correctly', async () => {
  const initialBookmarks = [
    { id: "1", title: "First", url: "http://first.com", note: "" },
    { id: "2", title: "Second", url: "http://second.com", note: "" }
  ];
  await writeBookmarks(initialBookmarks, tempFile);
  const bookmarks = await readBookmarks(tempFile);
  const afterDeletion = bookmarks.filter(b => b.id !== "1");
  await writeBookmarks(afterDeletion, tempFile);
  const readAfterDeletion = await readBookmarks(tempFile);
  expect(readAfterDeletion.some(b => b.id === "1")).toBeFalsy();
  expect(readAfterDeletion.length).toEqual(1);
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
