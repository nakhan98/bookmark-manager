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
- `/nginx` - Nginx configuration for reverse proxy
  - `/certs` - Directory for SSL certificates (contents gitignored)

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

# Run with docker-compose (force recreate containers)
make dc_run
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
npm test
```

## License

MIT

Note: this project was created using the help of aider and claude code (to evaluate them).
