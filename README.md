# Personal Organiser Application

A comprehensive multi-user personal organiser web application built with Next.js, evolving from a simple bookmark manager.

## Features

- Multi-user authentication system with strict access control
- Bookmark management with folders, tags, and search functionality
- Notes with rich text/markdown support
- Calendar with event scheduling and notifications
- Photo gallery with albums and basic editing
- File storage system
- Complete RESTful API for all features
- Responsive design for both mobile and desktop experiences

### Admin-Only Endpoints

- The `/api/auth/register` and `/api/auth/reset-password` endpoints are protected and require an admin JWT token.
- Only users with `"isAdmin": true` in `data/auth.json` can register new users or reset passwords via the API.
- To obtain an admin JWT, log in as an admin and use the returned token in the `Authorization: Bearer <token>` header.

## Project Structure

- `app/` — Next.js app directory (pages, layouts, components)
- `pages/api/` — REST API endpoints (authentication, bookmarks, etc.)
- `lib/` — Shared server-side utilities (auth, JWT, etc.)
- `data/` — JSON data storage (user accounts, bookmarks, etc.)
- `scripts/` — Utility scripts (user management, password reset helper)
- `tests/` — Automated tests (unit, integration, UI)

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker/Podman (optional)

### Environment Variables

- `JWT_SECRET` (required): Secret key for signing JWT tokens.  
  **You must set this in your environment before running the app.**
  Example for local development:  
  ```sh
  export JWT_SECRET="your-very-strong-secret"
  ```

### Local Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Development

Build and run using Docker/Podman:

```bash
# Build the Docker image
make docker_build

# Run in Docker
make docker_run

# Install dependencies in Docker
make docker_install

# Run tests in Docker
make docker_test
```


## Testing

Run tests with:

```bash
npm test                 # Run all tests
npm run test:api         # Run API and library tests only
npm run test:ui          # Run UI component tests only
npm run test:coverage    # Generate coverage report
```

### Test Coverage

The project includes comprehensive test coverage for:

- **Library Functions**: 100% line coverage of the core bookmark utility functions
- **API Endpoints**: Tests cover all CRUD operations, error handling, and edge cases
- **UI Components**: Tests for React components including form validation and user interactions
- **Utils**: Tests for utility functions like URL processing and favicon handling

Test categories:
- Unit tests for core functions
- API endpoint tests with proper mocking
- Integration tests for full CRUD flows
- UI component tests with React Testing Library

## License

MIT

## User Management Script

You can add or update users (including admin users) directly in `data/auth.json` using the CLI script:

```sh
python scripts/reset_password_helper.py <username> <password> <email> [--admin]
```

- Use `--admin` to grant admin privileges.
- The script will create or update the user in `data/auth.json`.

## Example: Registering a User via API

1. Log in as an admin to get a JWT token:
   ```sh
   TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"adminuser","password":"adminpassword"}' | jq -r .token)
   ```

2. Register a new user:
   ```sh
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"username":"newuser","email":"newuser@example.com","password":"newpassword"}'
   ```

## Development Tools

This project was developed with assistance from:

- [Aider](https://aider.ai) using OpenAI's [o3-mini model](https://platform.openai.com/docs/models/o3-mini)
- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
