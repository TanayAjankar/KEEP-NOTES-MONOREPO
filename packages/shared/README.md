# Shared Package

This directory contains shared modules and utilities used across the Keep Notes monorepo. By centralizing common logic, types, and configurations here, we promote code reuse, consistency, and easier maintenance across all applications (desktop, mobile, and server).

## Features

- Centralized state management logic (e.g., Redux Toolkit store)
- Pre-configured Axios instances for API requests
- Utility functions and helpers
- Shared TypeScript types or interfaces (if applicable)
- Application-wide constants and enums

## Development

To use or contribute to shared modules:

1. Import utilities, types, or configurations from this package in your application (desktop, mobile, or server).
2. When adding new shared logic, ensure it is generic and reusable across platforms.
3. Test changes in all relevant applications to avoid breaking shared functionality.

By organizing shared code in this directory, you can avoid duplication and ensure that all applications benefit from updates and bug fixes in shared logic.

## Installing Dependencies

If you need to add a dependency to the shared package, run the following command from the root of the monorepo:

```sh
pnpm add <package-name> --filter ./packages/shared
```

This ensures the dependency is added only to the shared package.