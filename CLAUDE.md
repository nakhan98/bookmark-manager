# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: Claude Code is being run inside a Podman container.

## Build, Lint, and Test Commands
```bash
npm run dev          # Start development server with turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run all tests
npm run test:api     # Run API tests only
npm run test:ui      # Run UI tests only
npx jest tests/path/to/file.test.js  # Run single test file
npx jest -t "test name pattern"      # Run tests matching pattern
```

## Code Style Guidelines
- TypeScript with strict type checking
- 2-space indentation, single quotes, semicolons, trailing commas
- PascalCase for components, camelCase for variables/functions
- Import order: external deps → internal modules → styles
- Async/await for promises, try/catch for error handling
- Error responses use consistent pattern: `{ error: 'Message' }`
- Console errors for logging in catch blocks

## Testing Standards
- Jest for testing, tests in `/tests` with .test.js extension
- Coverage requirements: 80% statements/functions/lines, 50% branches
- Mock external dependencies in tests
