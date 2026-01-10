# Keep Notes Monorepo

This repository contains the codebase for the Keep Notes application, including mobile, desktop, server, and shared modules. The monorepo structure enables seamless development and code sharing across platforms, providing a unified note-taking experience.

## Packages

- **desktop/**: Desktop web application built for modern browsers
- **mobile/**: Cross-platform mobile application using React Native
- **server/**: Backend API and services
- **shared/**: Shared utilities, types, and modules used across applications

## Features

- Cross-platform note-taking (web, mobile)
- User authentication and secure access
- CRUD operations for notes
- Synchronization between clients and backend
- Shared logic and types for consistency

## Development

To get started with local development, follow these steps:

1. Install dependencies using the monorepo's package manager (e.g., `pnpm install`).
2. Refer to the individual package README files for platform-specific setup and scripts.
3. Ensure you have the required environment variables and configuration files for each package.

For more details, refer to the documentation in each package directory.

## Monorepo Commands: Install, Build, Run

Understanding when to use install, build, and run commands is essential for efficient development in a monorepo setup:

### 1. Install (`pnpm install`)
- **When:** First time you clone the repo, or after dependencies change.
- **What:** Installs all dependencies for every package in the monorepo.

### 2. Build (`pnpm run build` or `pnpm -r run build`)
- **When:** After installing dependencies, before deploying, or after making changes to source code that needs compiling (e.g., TypeScript, React, etc.).
- **What:** Compiles/transpiles/bundles code as defined in each package's `build` script.

### 3. Run (`pnpm run start`, `pnpm run dev`, or `pnpm -r run start`)
- **When:** To start your application, either in production (`start`) or development (`dev`) mode.
- **What:** Runs the app as defined in each package's `start` or `dev` script.

### Typical Workflow

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Build all packages:**
   ```sh
   pnpm -r run build
   ```
3. **Run all apps:**
   ```sh
   pnpm -r run start
   # or for development
   pnpm -r run dev
   ```

### Summary Table

| Command           | When to Use                                 | What it Does                                 |
|-------------------|---------------------------------------------|----------------------------------------------|
| install           | First time, after dependency changes        | Installs dependencies                        |
| build             | After install, before deploy, after changes | Compiles/bundles/transpiles code             |
| run start         | To run the app (prod)                       | Starts the app                               |
| run dev           | To run the app (dev)                        | Starts the app in development mode           |