# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: Claude Code is being run inside a Podman container.

## Project Overview
This is a personal organiser application that includes multiple features:
- Authentication system with secure user management
- Bookmarks with organization and search capabilities
- Notes with rich text editor and markdown support
- Calendar with event scheduling and notifications
- Photo gallery with albums and basic editing
- File storage system with folder structure

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
- IMPORTANT: All new features MUST include appropriate tests
- Tests should cover both happy path and error cases
- UI components should have basic rendering and interaction tests
- API endpoints must have comprehensive test coverage

## API Standards
- RESTful API design with consistent patterns across all endpoints
- JWT authentication for all protected routes
- Standard error response format: `{ error: 'Message' }`
- Pagination for list endpoints that may return large result sets
- API versioning strategy to be implemented when needed

## Security Guidelines
- All user authentication must use secure password hashing
- All routes must validate user permissions
- Input validation and sanitization required for all user inputs
- HTTPS will be managed separately when deployed to production (not a concern for application development)
- Implement rate limiting on authentication endpoints
- Sensitive operations should require re-authentication

## Documentation Maintenance
- Keep `spec.md`, `CLAUDE.md`, and `README.md` in sync when implementing new features
- Update documentation as part of feature implementation, not as an afterthought

## Version Control Guidelines
- Commit changes regularly with descriptive, meaningful commit messages
- Follow conventional commit format: `type(scope): message` 
  - Example: `feat(auth): add JWT token authentication`
  - Common types: feat, fix, docs, style, refactor, test, chore
- Keep commits focused on a single logical change
- Include issue/ticket references when applicable
- Always ensure the application builds and passes tests before committing
- This applies to both human developers and AI agents
