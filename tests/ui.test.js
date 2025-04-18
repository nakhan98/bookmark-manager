/**
 * @jest-environment jsdom
 */

const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom');
const { act } = require('react-dom/test-utils');

// Cannot directly import Next.js components in Jest environment without extensive mocking
// So we will simulate a Home component for testing purposes
const Home = () => null;

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock window scrollTo
window.scrollTo = jest.fn();

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock window.confirm
window.confirm = jest.fn();

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock for fetch
    fetch.mockImplementation((url, options) => {
      // GET bookmarks
      if (url === '/api/bookmarks' && (!options || options.method === undefined || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: '1', title: 'Example', url: 'https://example.com', note: 'Example note' },
            { id: '2', title: 'Another', url: 'https://another.com', note: '' }
          ]),
        });
      }
      
      // For other API calls
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '3', title: 'New Bookmark', url: 'https://new.com' }),
      });
    });
    
    // Default for confirm is true
    window.confirm.mockImplementation(() => true);
  });

  test('renders bookmarks from API', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Check if the header is rendered
    expect(screen.getByText('Bookmark Manager')).toBeInTheDocument();
    
    // Check if the bookmarks are rendered
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Another')).toBeInTheDocument();
    
    // Check fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/bookmarks');
  });

  test('shows loading state and then bookmarks', async () => {
    // Delay the API response
    fetch.mockImplementationOnce(() => 
      new Promise((resolve) => 
        setTimeout(() => 
          resolve({
            ok: true,
            json: () => Promise.resolve([
              { id: '1', title: 'Example', url: 'https://example.com' }
            ])
          }), 
          100
        )
      )
    );
    
    let component;
    
    // First render shows loading
    await act(async () => {
      component = render(<Home />);
    });
    
    // Initially show loading spinner (use a more flexible selector)
    expect(component.container.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Example')).toBeInTheDocument();
    });
    
    // Loading spinner should be gone
    expect(component.container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  test('adds a new bookmark', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Click Add Bookmark button
    fireEvent.click(screen.getByText('Add Bookmark'));
    
    // Form should be visible
    expect(screen.getByText('Add New Bookmark')).toBeInTheDocument();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/URL/i), {
      target: { value: 'new-example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Bookmark'));
    
    // Verify the API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookmarks', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('https://new-example.com')
      }));
    });
    
    // Form should be hidden after submit
    await waitFor(() => {
      expect(screen.queryByText('Add New Bookmark')).not.toBeInTheDocument();
    });
  });

  test('edits an existing bookmark', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Find and click the Edit button for the first bookmark
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Form should be visible with populated data
    expect(screen.getByText('Edit Bookmark')).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i).value).toBe('https://example.com');
    
    // Change the URL
    fireEvent.change(screen.getByLabelText(/URL/i), {
      target: { value: 'https://updated-example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Update Bookmark'));
    
    // Verify the API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookmarks', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('https://updated-example.com')
      }));
    });
  });

  test('deletes a bookmark with confirmation', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Find and click the Delete button for the first bookmark
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm should have been called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this bookmark?');
    
    // Verify the API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookmarks', expect.objectContaining({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"id":"1"')
      }));
    });
  });

  test('does not delete when confirmation is cancelled', async () => {
    // Mock confirm to return false
    window.confirm.mockImplementationOnce(() => false);
    
    await act(async () => {
      render(<Home />);
    });
    
    // Find and click the Delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm should have been called
    expect(window.confirm).toHaveBeenCalled();
    
    // API should NOT have been called with DELETE
    expect(fetch).not.toHaveBeenCalledWith('/api/bookmarks', expect.objectContaining({
      method: 'DELETE'
    }));
  });

  test('filters bookmarks with search', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Initially both bookmarks are visible
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('Another')).toBeInTheDocument();
    
    // Type in search box
    fireEvent.change(screen.getByPlaceholderText('Search bookmarks...'), {
      target: { value: 'Example' }
    });
    
    // Only the matching bookmark should be visible
    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.queryByText('Another')).not.toBeInTheDocument();
  });

  test('shows error message when API call fails', async () => {
    // Mock failed API response for form submission
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { id: '1', title: 'Example', url: 'https://example.com' }
      ])
    }));
    
    // Mock failed second API call
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'URL already exists' })
    }));
    
    await act(async () => {
      render(<Home />);
    });
    
    // Click Add Bookmark button
    fireEvent.click(screen.getByText('Add Bookmark'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/URL/i), {
      target: { value: 'duplicate.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Bookmark'));
    
    // Error message should be displayed
    await waitFor(() => {
      expect(screen.getByText('URL already exists')).toBeInTheDocument();
    });
  });

  test('validates required URL field', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    // Click Add Bookmark button
    fireEvent.click(screen.getByText('Add Bookmark'));
    
    // Submit without filling URL
    fireEvent.click(screen.getByText('Save Bookmark'));
    
    // Error should be displayed
    expect(screen.getByText('URL is required')).toBeInTheDocument();
    
    // API should not have been called
    expect(fetch).not.toHaveBeenCalledWith('/api/bookmarks', expect.objectContaining({
      method: 'POST'
    }));
  });
});