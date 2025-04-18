const fs = require('fs/promises');
const path = require('path');
const { readBookmarks, writeBookmarks, fetchPageTitle } = require('../lib/bookmarks');

const tempFile = path.join(__dirname, 'temp_bookmarks.json');

// Mock fetch for testing fetchPageTitle
global.fetch = jest.fn();

describe('Basic Bookmark Operations', () => {
  afterEach(async () => {
    try {
      await fs.unlink(tempFile);
    } catch (error) {
      // ignore if file doesn't exist
    }
    jest.resetAllMocks();
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

  test('readBookmarks handles corrupted JSON file', async () => {
    await fs.writeFile(tempFile, 'not valid json', 'utf8');
    const bookmarks = await readBookmarks(tempFile);
    expect(bookmarks).toEqual([]);
  });
});

describe('fetchPageTitle Function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('successfully fetches and extracts page title', async () => {
    const mockHtml = '<html><head><title>Test Page Title</title></head><body></body></html>';
    fetch.mockResolvedValueOnce({
      text: async () => mockHtml
    });

    const title = await fetchPageTitle('https://example.com');
    expect(title).toBe('Test Page Title');
    expect(fetch).toHaveBeenCalledWith('https://example.com');
  });

  test('handles missing title tag in HTML', async () => {
    const mockHtml = '<html><head></head><body>No title here</body></html>';
    fetch.mockResolvedValueOnce({
      text: async () => mockHtml
    });

    const title = await fetchPageTitle('https://example.com');
    expect(title).toBeNull();
  });

  test('handles fetch errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const title = await fetchPageTitle('https://example.com');
    expect(title).toBeNull();
  });
  
  test('extracts title with different casing and whitespace', async () => {
    const mockHtml = '<html><head><TITLE>  Whitespace Title  </TITLE></head><body></body></html>';
    fetch.mockResolvedValueOnce({
      text: async () => mockHtml
    });

    const title = await fetchPageTitle('https://example.com');
    expect(title).toBe('Whitespace Title');
  });
});
