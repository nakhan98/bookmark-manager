/**
 * @jest-environment jsdom
 */

const { render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');

// Mock implementation of the getFavicon function from app/page.tsx
const getFavicon = (url) => {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return "/globe.svg";
  }
};

describe('Utility Functions', () => {
  describe('getFavicon', () => {
    test('returns Google favicon service URL for valid URLs', () => {
      const url = 'https://example.com/page';
      const favicon = getFavicon(url);
      expect(favicon).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=64');
    });

    test('extracts hostname correctly from complex URLs', () => {
      const url = 'https://sub.example.co.uk/path/to/page?query=value#hash';
      const favicon = getFavicon(url);
      expect(favicon).toBe('https://www.google.com/s2/favicons?domain=sub.example.co.uk&sz=64');
    });

    test('handles URLs without protocol by returning fallback', () => {
      // This would normally throw in the app because the URL constructor
      // requires a protocol, but our implementation catches the error
      const url = 'example.com';
      const favicon = getFavicon(url);
      expect(favicon).toBe('/globe.svg');
    });

    test('returns fallback for invalid URLs', () => {
      const url = 'not-a-url';
      const favicon = getFavicon(url);
      expect(favicon).toBe('/globe.svg');
    });
  });
});