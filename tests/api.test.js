const { readBookmarks, writeBookmarks } = require('../lib/bookmarks');
const handler = require('../pages/api/bookmarks').default;

// Mock the bookmarks module
jest.mock('../lib/bookmarks');

describe('API Endpoints', () => {
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET endpoint', () => {
    test('returns all bookmarks', async () => {
      const mockBookmarks = [
        { id: '1', title: 'Example', url: 'https://example.com' }
      ];
      readBookmarks.mockResolvedValue(mockBookmarks);

      const req = mockReq('GET');
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBookmarks);
      expect(readBookmarks).toHaveBeenCalled();
    });
  });

  describe('POST endpoint', () => {
    test('creates a new bookmark with complete data', async () => {
      const mockExistingBookmarks = [];
      readBookmarks.mockResolvedValue(mockExistingBookmarks);
      
      // We're not mocking random ID generation as our implementation changed

      // Mock toISOString for predictable dates
      const mockDate = new Date();
      const mockISOString = '2023-01-01T00:00:00.000Z';
      mockDate.toISOString = jest.fn(() => mockISOString);
      global.Date = jest.fn(() => mockDate);

      const newBookmark = {
        title: 'Test Title',
        url: 'https://test.com',
        note: 'Test note'
      };

      const req = mockReq('POST', newBookmark);
      const res = mockRes();

      await handler(req, res);

      // Restore Date functions
      jest.restoreAllMocks();
      global.Date = Date;

      // Extract the bookmark that was saved
      const savedBookmark = writeBookmarks.mock.calls[0][0][0];
      
      // Check that all properties except ID match our expectations
      expect(savedBookmark).toMatchObject({
        title: 'Test Title',
        url: 'https://test.com',
        note: 'Test note',
        creationDate: mockISOString,
        modifiedDate: mockISOString
      });
      
      // Verify that ID is a non-empty string
      expect(typeof savedBookmark.id).toBe('string');
      expect(savedBookmark.id.length).toBeGreaterThan(0);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedBookmark);
    });

    test('adds https:// prefix to URLs when missing', async () => {
      readBookmarks.mockResolvedValue([]);
      
      const req = mockReq('POST', {
        title: 'Test Title',
        url: 'test.com',
        note: 'Test note'
      });
      const res = mockRes();

      await handler(req, res);

      // Extract the bookmark passed to writeBookmarks
      const savedBookmark = writeBookmarks.mock.calls[0][0][0];
      expect(savedBookmark.url).toBe('https://test.com');
    });

    test('rejects duplicate URLs', async () => {
      const existingUrl = 'https://example.com';
      const existingBookmarks = [
        { id: '1', title: 'Example', url: existingUrl }
      ];
      readBookmarks.mockResolvedValue(existingBookmarks);
      
      const req = mockReq('POST', {
        title: 'New Title',
        url: existingUrl
      });
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bookmark with the same URL already exists' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });

    test('requires URL field', async () => {
      const req = mockReq('POST', { title: 'Title Only' });
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'URL required' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });

    test('auto-fetches title when not provided', async () => {
      readBookmarks.mockResolvedValue([]);
      
      const fetchedTitle = 'Fetched Title';
      const mockUrl = 'https://example.com';
      
      // Mock the fetchPageTitle function
      const { fetchPageTitle } = require('../lib/bookmarks');
      fetchPageTitle.mockResolvedValue(fetchedTitle);
      
      const req = mockReq('POST', {
        url: mockUrl
      });
      const res = mockRes();

      await handler(req, res);

      expect(fetchPageTitle).toHaveBeenCalledWith(mockUrl);
      
      // Extract the bookmark passed to writeBookmarks
      const savedBookmark = writeBookmarks.mock.calls[0][0][0];
      expect(savedBookmark.title).toBe(fetchedTitle);
    });

    test('uses domain name as fallback title when fetch fails', async () => {
      readBookmarks.mockResolvedValue([]);
      
      // Mock the fetchPageTitle function to return null (failed fetch)
      const { fetchPageTitle } = require('../lib/bookmarks');
      fetchPageTitle.mockResolvedValue(null);
      
      const req = mockReq('POST', {
        url: 'https://example.com/path'
      });
      const res = mockRes();

      await handler(req, res);
      
      // Extract the bookmark passed to writeBookmarks
      const savedBookmark = writeBookmarks.mock.calls[0][0][0];
      expect(savedBookmark.title).toBe('example.com');
    });
  });

  describe('PUT endpoint', () => {
    test('updates an existing bookmark', async () => {
      const existingBookmarks = [
        { id: '1', title: 'Original', url: 'https://original.com', note: 'Original note', creationDate: '2023-01-01T00:00:00.000Z' }
      ];
      readBookmarks.mockResolvedValue(existingBookmarks);
      
      // Mock for modifiedDate
      const mockDate = new Date();
      const mockISOString = '2023-02-01T00:00:00.000Z';
      mockDate.toISOString = jest.fn(() => mockISOString);
      global.Date = jest.fn(() => mockDate);

      const req = mockReq('PUT', {
        id: '1',
        title: 'Updated Title',
        url: 'https://updated.com',
        note: 'Updated note'
      });
      const res = mockRes();

      await handler(req, res);

      // Restore Date
      global.Date = Date;

      const expectedBookmark = {
        id: '1',
        title: 'Updated Title',
        url: 'https://updated.com',
        note: 'Updated note',
        creationDate: '2023-01-01T00:00:00.000Z',
        modifiedDate: mockISOString
      };

      expect(writeBookmarks).toHaveBeenCalledWith([expectedBookmark]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedBookmark);
    });

    test('rejects updates to non-existent bookmarks', async () => {
      readBookmarks.mockResolvedValue([]);
      
      const req = mockReq('PUT', {
        id: 'nonexistent',
        title: 'Updated Title',
        url: 'https://updated.com'
      });
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Bookmark not found' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });

    test('requires ID and URL fields', async () => {
      const req = mockReq('PUT', { title: 'Title Only' });
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID and URL required' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });

    test('prevents duplicate URLs when updating', async () => {
      const existingBookmarks = [
        { id: '1', title: 'First', url: 'https://first.com' },
        { id: '2', title: 'Second', url: 'https://second.com' }
      ];
      readBookmarks.mockResolvedValue(existingBookmarks);
      
      // Try to update bookmark 1 to have the same URL as bookmark 2
      const req = mockReq('PUT', {
        id: '1',
        title: 'Updated First',
        url: 'https://second.com'
      });
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Another bookmark with the same URL already exists' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });
  });

  describe('DELETE endpoint', () => {
    test('deletes an existing bookmark', async () => {
      const existingBookmarks = [
        { id: '1', title: 'First', url: 'https://first.com' },
        { id: '2', title: 'Second', url: 'https://second.com' }
      ];
      readBookmarks.mockResolvedValue(existingBookmarks);
      
      const req = mockReq('DELETE', { id: '1' });
      const res = mockRes();

      await handler(req, res);

      const expectedBookmarksAfterDeletion = [
        { id: '2', title: 'Second', url: 'https://second.com' }
      ];

      expect(writeBookmarks).toHaveBeenCalledWith(expectedBookmarksAfterDeletion);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bookmark deleted' });
    });

    test('requires ID field', async () => {
      const req = mockReq('DELETE', {});
      const res = mockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'ID required' });
      expect(writeBookmarks).not.toHaveBeenCalled();
    });

    test('silently ignores deletion of non-existent bookmarks', async () => {
      const existingBookmarks = [
        { id: '1', title: 'First', url: 'https://first.com' }
      ];
      readBookmarks.mockResolvedValue(existingBookmarks);
      
      const req = mockReq('DELETE', { id: 'nonexistent' });
      const res = mockRes();

      await handler(req, res);

      // Should still return success even though nothing was deleted
      expect(writeBookmarks).toHaveBeenCalledWith(existingBookmarks);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Method handling', () => {
    test('rejects unsupported methods', async () => {
      const req = mockReq('PATCH');
      const res = mockRes();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.end).toHaveBeenCalledWith('Method PATCH Not Allowed');
    });
  });
});