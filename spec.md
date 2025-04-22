# Personal Organiser Application Specification

## Overview
This application is an evolution of a simple single-user bookmark manager built with Next.js. The goal is to expand it into a comprehensive multi-user personal organiser with secure authentication and various productivity features including bookmarks, notes, calendar events, photo management, and file storage.

## Core Architecture

### Technology Stack
- **Frontend**: Next.js with React
  - Client-side rendering for UI components
  - Responsive design for mobile and desktop experiences
- **Backend**: 
  - Complete REST API implementation using Next.js API routes (or consider dedicated backend if complexity increases)
  - API-first design to support future mobile clients
- **Database**: Consider migrating from JSON files to a proper database system
  - Options: MongoDB, PostgreSQL, or SQLite for simpler deployments
- **Authentication**: NextAuth.js for handling authentication flows
- **Storage**: Local file system initially, with planned migration to cloud storage (S3, Google Cloud Storage, etc.)
- **Styling**: Tailwind CSS for responsive design

### Data Models

#### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // Securely stored
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLogin: Date;
}
```

## Feature Specifications

### Authentication System
- Secure login via username/email and password
- User credentials stored in `data/auth.json` with the following structure:
```json
{
  "username": {
    "password": "sha1sum(salt+password+last_modified_date)",
    "last_modified_date": "2025-04-20T12:00:00Z"
  },
  "another_user": {
    "password": "sha1sum(salt+password+last_modified_date)",
    "last_modified_date": "2025-04-18T09:30:00Z"
  }
}
```
- Password requirements (minimum length, complexity)
- Account recovery flow
- Session management with JWT tokens
- Rate limiting on login attempts
- Strict access control: unauthenticated users should only see the login screen
- Server-side and client-side protection for all protected resources
- No flashing of protected content before authentication checks complete
- Future: Google SSO integration

### Navigation & UI
- Responsive sidebar/navbar with main navigation items
- Tab-based navigation for each main feature
- Consistent layout and styling across all features
- Mobile-friendly design
- User profile and settings area

### Bookmarks Feature
- **Data Storage**: `/data/bookmarks/{userId}.json` or in database
- **Data Model**:
```typescript
interface Bookmark {
  id: string;
  userId: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  tags?: string[];
  folderPath?: string; // For organization
  createdAt: Date;
  lastVisited?: Date;
}
```
- **Functionality**:
  - Add, edit, delete bookmarks
  - Organize in folders/categories
  - Search and filter
  - Import/export bookmarks
  - Optional browser extension integration

### Notes Feature
- **Data Storage**: `/data/notes/{userId}/{noteId}.json` or in database
- **Data Model**:
```typescript
interface Note {
  id: string;
  userId: string;
  title: string;
  content: string; // Consider markdown support
  createdAt: Date;
  modifiedAt: Date;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
}
```
- **Functionality**:
  - Rich text editor with markdown support
  - Note organization with tags
  - Search functionality
  - Sorting options (date, title, etc.)
  - Pinned notes

### Calendar Feature
- **Data Storage**: `/data/calendar/{userId}.json` or in database
- **Data Model**:
```typescript
interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  location?: string;
  color?: string;
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    endAfter?: number | Date;
  };
  notifications?: {
    time: number; // Minutes before event
    type: 'email' | 'push' | 'in-app';
  }[];
}
```
- **Functionality**:
  - Monthly, weekly, daily views
  - Create, edit, delete events
  - Recurring events
  - Event reminders/notifications
  - Future: Google Calendar sync

### Photo Gallery Feature
- **Data Storage**: `/data/photos/{userId}/{albumId}/{filename}` or cloud storage
- **Data Model**:
```typescript
interface Photo {
  id: string;
  userId: string;
  albumId?: string;
  filename: string;
  originalFilename: string;
  path: string;
  thumbnailPath: string;
  mimeType: string;
  size: number; // In bytes
  dimensions?: {
    width: number;
    height: number;
  };
  takenAt?: Date;
  uploadedAt: Date;
  metadata?: Record<string, any>; // EXIF data
}

interface Album {
  id: string;
  userId: string;
  name: string;
  description?: string;
  coverPhotoId?: string;
  createdAt: Date;
  modifiedAt: Date;
}
```
- **Functionality**:
  - Photo upload with drag-and-drop
  - Album creation and management
  - Basic photo editing (crop, rotate, etc.)
  - Slideshow view
  - Download options
  - Sharing capabilities

### File Storage Feature
- **Data Storage**: `/data/files/{userId}/{filepath}` or cloud storage
- **Data Model**:
```typescript
interface File {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  path: string;
  mimeType: string;
  size: number; // In bytes
  folderId?: string;
  uploadedAt: Date;
  modifiedAt: Date;
}

interface Folder {
  id: string;
  userId: string;
  name: string;
  parentFolderId?: string;
  createdAt: Date;
}
```
- **Functionality**:
  - File upload and download
  - Folder creation and navigation
  - File type previews when possible
  - Search functionality
  - Storage quota management

## API Endpoints

The application will expose a comprehensive REST API to support both web and future mobile clients. All API endpoints will follow REST principles and return JSON responses with appropriate HTTP status codes.

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user and return JWT
- `POST /api/auth/logout` - End session
- `POST /api/auth/reset-password` - Password reset flow

### Bookmarks
- `GET /api/bookmarks` - List all bookmarks for current user
- `POST /api/bookmarks` - Create new bookmark
- `GET /api/bookmarks/:id` - Get specific bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark

### Notes
- `GET /api/notes` - List all notes for current user
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Calendar
- `GET /api/calendar` - List all events for current user
- `POST /api/calendar` - Create new event
- `GET /api/calendar/:id` - Get specific event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

### Photos
- `GET /api/photos` - List all photos for current user
- `POST /api/photos` - Upload new photo
- `GET /api/photos/:id` - Get specific photo
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/albums` - List all albums
- `POST /api/albums` - Create new album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album

### Files
- `GET /api/files` - List files/folders for current user
- `POST /api/files` - Upload new file
- `GET /api/files/:id` - Get specific file
- `DELETE /api/files/:id` - Delete file
- `POST /api/folders` - Create new folder
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder

## Implementation Phases

### Phase 1: Foundation
- Multi-user authentication system (implemented: registration, login, logout, and reset-password endpoints are complete and tested)
- Basic UI navigation framework (implemented: initial layout and navigation components are complete, including protected routes and redirection to login when unauthenticated)
- Core REST API implementation with authentication (implemented: authentication endpoints and middleware are fully functioning; bookmarks API endpoints (GET, POST, PUT, DELETE) are complete. Endpoints for notes, calendar, photo management, and file storage are planned for future phases)
- Migration of bookmarks feature to multi-user (implemented: full CRUD (GET, POST, PUT, DELETE) for bookmarks tested and functioning)

### Phase 2: Core Features
- Notes implementation
- Basic calendar implementation
- Simple file storage
- Client-side rendering optimizations

### Phase 3: Enhanced Features
- Photo gallery implementation
- Calendar improvements
- UI/UX refinements
- API documentation and developer portal

### Phase 4: Integration & Advanced Features
- Google SSO integration
- Google Calendar sync
- Mobile client support improvements
- Advanced search across all features
- Sharing capabilities

## Technical Considerations

### API Design
- Complete REST API implementation with consistent patterns
- API versioning strategy (e.g., `/api/v1/...`)
- Comprehensive API documentation using Swagger/OpenAPI
- Response standardization (consistent error formats, pagination methods)
- Authentication via JWT bearer tokens
- Rate limiting and throttling for API endpoints
- CORS configuration to support multiple client origins

### Security
- Application will be behind an nginx reverse proxy that handles SSL termination
- All traffic to and from the web application will be over HTTPS when deployed to production (this will be handled separately and is not a concern for application development)
- Proper authentication and authorization checks on all routes
- Complete protection of all resources from unauthenticated access
- Server-side middleware to prevent access to protected routes
- Client-side guards to prevent rendering of protected content
- Input validation and sanitization
- Protection against common vulnerabilities (XSS, CSRF, etc.)

### Performance
- Lazy loading of features/components
- Optimized image handling (resizing, compression)
- Pagination for large data sets
- Caching strategies

### Scalability
- Consider database migration strategy from file-based storage
- Plan for cloud storage integration for photos and files
- API rate limiting

### Testing
- Unit tests for core functionality
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- REQUIREMENT: All new features MUST be accompanied by appropriate tests
- API endpoints require tests for success and failure scenarios
- UI components need rendering and user interaction tests
- Minimum test coverage requirements: 80% statements/functions/lines, 50% branches
- Both developers and AI agents should write tests when implementing features

## Design Guidelines
- Clean, minimalist interface
- Consistent color scheme and typography
- Responsive design for all screen sizes
- Clear visual hierarchy
- Accessible design (WCAG compliance)

## Future Considerations
These items are not critical for initial development but should be considered as the application matures or if user base grows significantly.

### Error Handling & Logging
- Standardized error response format across all API endpoints
- Centralized error logging system
- User-friendly error messages
- Monitoring dashboard for application health

### Authorization & User Management
- Role-based access control (e.g., admin, standard user)
- Content sharing permissions between users
- User settings and preferences storage
- Account deactivation and data export functionality

### Data Resilience
- Regular backup strategy for user data
- Data migration path from file-based storage to database
- Data recovery procedures
- Storage quota management per user

### Advanced User Experience
- Advanced mobile interface optimizations
- Offline functionality for critical features
- Push notifications for calendar events and shared content
- Progressive Web App (PWA) capabilities

### Performance & Scaling
- Caching strategies for frequently accessed data
- Database query optimization
- Load balancing for increased user traffic
- Content delivery optimization for media assets

### Development & Operations
- Comprehensive test coverage (unit, integration, end-to-end)
- CI/CD pipeline for automated testing and deployment
- Environment configuration management
- Analytics for feature usage and user behavior

## Documentation Maintenance
- This specification document (`spec.md`), `CLAUDE.md`, and `README.md` should be kept in sync and updated as development progresses
- All developers and AI agents should update these documents when implementing new features or making significant changes
- Documentation updates should be treated as part of the implementation process, not as an afterthought
- When completing a feature or making architectural changes, update the corresponding sections in all relevant documentation files

## Version Control Guidelines
- Commit changes regularly with descriptive, meaningful commit messages
- Follow conventional commit message format: `type(scope): message` (e.g., `feat(auth): add JWT token authentication`)
- Common types: feat, fix, docs, style, refactor, test, chore
- Keep commits focused on a single task or fix
- Include references to relevant issues/tickets in commit messages when applicable
- Before committing, ensure the application builds and passes tests
- This applies to both human developers and AI agents
