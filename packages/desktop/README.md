# Desktop Web Application

This directory contains the codebase for the Desktop Web Application of the Keep Notes monorepo. The application is designed to provide a full-featured note-taking experience optimized for desktop browsers, including advanced UI components, state management, and integration with shared modules from the monorepo.

## Features

- Responsive and user-friendly interface for desktop users
- Integration with shared utilities, types, and state management from the `shared` package
- Authentication and secure access to user notes
- Support for CRUD operations on notes
- Synchronization with backend APIs

## Development

To get started with local development, follow the instructions in the main repository README and ensure all dependencies are installed via the monorepo's package manager.

## Installing New Dependencies

If you need to add a dependency to the desktop package, run the following command from the root of the monorepo:

```sh
pnpm add <package-name> --filter ./packages/desktop
```

This ensures the dependency is added only to the desktop package.

## Structure

- `src/` - Main source code for the desktop application
- `public/` - Static assets and HTML template
- `package.json` - Project configuration and scripts

For more details, refer to the documentation in the root of the repository.