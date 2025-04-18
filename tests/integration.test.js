const fs = require('fs/promises');
const path = require('path');
const { readBookmarks, writeBookmarks, fetchPageTitle } = require('../lib/bookmarks');
const handler = require('../pages/api/bookmarks').default;

// Create a temporary file for integration tests
const tempFile = path.join(__dirname, 'integration_bookmarks.json');

// Mock URL constructor and fetch for tests
global.URL = jest.fn(url => ({
  hostname: url.replace(/https?:\/\//, '').split('/')[0]
}));

global.fetch = jest.fn();

// Mock the bookmarks file path to use our temp file
jest.mock('../lib/bookmarks', () => {
  const originalModule = jest.requireActual('../lib/bookmarks');
  return {
    ...originalModule,
    BOOKMARKS_FILE: tempFile
  };
});

describe('Integration Tests', () => {
  const mockReq = (method, body = {}) => ({
    method,
    body
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
  };

  // Setup and teardown
  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Ensure we start with a clean file
    try {
      await fs.writeFile(tempFile, JSON.stringify([]));
    } catch (error) {
      // ignore errors
    }
    
    // Mock successful title fetch
    fetch.mockResolvedValue({
      text: async () => '<html><head><title>Fetched Title</title></head><body></body></html>'
    });
  });

  afterAll(async () => {
    try {
      await fs.unlink(tempFile);
    } catch (error) {
      // ignore if file doesn't exist
    }
  });

  test('End-to-end bookmark lifecycle: create, read, update, delete', async () => {
    // 1. Create a new bookmark
    const createReq = mockReq('POST', {
      url: 'example.com',
      note: 'Test note'
    });
    const createRes = mockRes();
    
    await handler(createReq, createRes);
    
    // Verify the response
    expect(createRes.status).toHaveBeenCalledWith(201);
    const createdBookmark = createRes.json.mock.calls[0][0];
    expect(createdBookmark.url).toBe('https://example.com');
    expect(createdBookmark.title).toBe('Fetched Title');
    
    // 2. Verify GET returns the created bookmark
    const getReq = mockReq('GET');
    const getRes = mockRes();
    
    await handler(getReq, getRes);
    
    // Verify GET response
    expect(getRes.status).toHaveBeenCalledWith(200);
    const returnedBookmarks = getRes.json.mock.calls[0][0];
    expect(returnedBookmarks).toHaveLength(1);
    expect(returnedBookmarks[0].id).toBe(createdBookmark.id);
    
    // 3. Update the bookmark
    const updateReq = mockReq('PUT', {
      id: createdBookmark.id,
      title: 'Updated Title',
      url: 'https://updated-example.com',
      note: 'Updated note'
    });
    const updateRes = mockRes();
    
    await handler(updateReq, updateRes);
    
    // Verify update response
    expect(updateRes.status).toHaveBeenCalledWith(200);
    const updatedBookmark = updateRes.json.mock.calls[0][0];
    expect(updatedBookmark.title).toBe('Updated Title');
    expect(updatedBookmark.url).toBe('https://updated-example.com');
    
    // 4. Verify GET returns the updated bookmark
    const getAfterUpdateReq = mockReq('GET');
    const getAfterUpdateRes = mockRes();
    
    await handler(getAfterUpdateReq, getAfterUpdateRes);
    
    // Verify GET after update
    const bookmarksAfterUpdate = getAfterUpdateRes.json.mock.calls[0][0];
    expect(bookmarksAfterUpdate).toHaveLength(1);
    expect(bookmarksAfterUpdate[0].title).toBe('Updated Title');
    
    // 5. Delete the bookmark
    const deleteReq = mockReq('DELETE', { id: createdBookmark.id });
    const deleteRes = mockRes();
    
    await handler(deleteReq, deleteRes);
    
    // Verify delete response
    expect(deleteRes.status).toHaveBeenCalledWith(200);
    
    // 6. Verify GET returns empty array after deletion
    const getFinalReq = mockReq('GET');
    const getFinalRes = mockRes();
    
    await handler(getFinalReq, getFinalRes);
    
    // Verify GET after delete
    const finalBookmarks = getFinalRes.json.mock.calls[0][0];
    expect(finalBookmarks).toHaveLength(0);
  });

  test('Prevents duplicate URLs from being added', async () => {
    // 1. Create initial bookmark
    const createFirstReq = mockReq('POST', {
      url: 'example.com',
      title: 'First Bookmark'
    });
    const createFirstRes = mockRes();
    await handler(createFirstReq, createFirstRes);
    
    // 2. Try to create duplicate URL
    const createDuplicateReq = mockReq('POST', {
      url: 'example.com',
      title: 'Duplicate URL'
    });
    const createDuplicateRes = mockRes();
    await handler(createDuplicateReq, createDuplicateRes);
    
    // Verify duplicate was rejected
    expect(createDuplicateRes.status).toHaveBeenCalledWith(400);
    expect(createDuplicateRes.json.mock.calls[0][0].error).toContain('already exists');
    
    // 3. Verify only one bookmark exists
    const getReq = mockReq('GET');
    const getRes = mockRes();
    await handler(getReq, getRes);
    
    const bookmarks = getRes.json.mock.calls[0][0];
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].title).toBe('First Bookmark');
  });
  
  test('Uses hostname as fallback when title fetching fails', async () => {
    // Mock failed title fetch
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const createReq = mockReq('POST', {
      url: 'test-example.com/page'
    });
    const createRes = mockRes();
    
    await handler(createReq, createRes);
    
    // Verify response uses hostname as title
    expect(createRes.status).toHaveBeenCalledWith(201);
    const createdBookmark = createRes.json.mock.calls[0][0];
    expect(createdBookmark.title).toBe('test-example.com');
  });
});