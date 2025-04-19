# Bookmark Manager

A simple web application for managing bookmarks built with Next.js.

## Features

- Store and manage website bookmarks
- RESTful API for CRUD operations
- Persistent storage using JSON files

## Project Structure

- `/app` - Next.js app directory with frontend components
- `/data` - Storage directory for bookmark data (gitignored)
- `/lib` - Core utility functions for bookmark handling
- `/pages/api` - API routes for bookmark operations

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker/Podman (optional)

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

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Example environment variables
PORT=3000
NODE_ENV=development
```

Note: The `.env` file is excluded from Docker builds via `.dockerignore`.

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

## Development Tools

This project was developed with assistance from:

- [Aider](https://aider.ai) using OpenAI's [o3-mini model](https://platform.openai.com/docs/models/o3-mini)
- [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)
