# Server

This directory contains the backend API and services for the Keep Notes monorepo. The server handles authentication, note management, synchronization, and integration with other applications in the monorepo.

## Features

- RESTful API for notes and user management
- User authentication and authorization
- Secure access to user data
- Rate limiting and request validation middleware
- Integration with shared modules for utilities and types
- Email notifications and other backend utilities

## Environment Variables

Before running the server, create a `.env` file in the `packages/server` directory with the following variables:

```
# Server
PORT=5001
SESSION_SECRET=your_session_secret
SERVER_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=keepnotes

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Adjust the values as needed for your local setup.

## Running the Server

1. Ensure your `.env` file is configured as above.
2. Install dependencies from the root of the monorepo:
   ```sh
   pnpm install
   ```
3. Start the server:
   ```sh
   pnpm --filter ./packages/server dev
   ```
   Or, if you have a start script:
   ```sh
   pnpm --filter ./packages/server start
   ```
4. The server should now be running at the host and port specified in your `.env` file.

## Development

To get started with local development:

1. Install dependencies using the monorepo's package manager (e.g., `pnpm install`).
2. Configure environment variables and database settings in the `config/` directory.
3. Use the provided scripts in `package.json` to run and test the server.
4. Refer to the code in `controllers/`, `models/`, and `routes/` for API logic and structure.

## Installing New Dependencies

If you need to add a dependency to the server package, run the following command from the root of the monorepo:

```sh
pnpm add <package-name> --filter ./packages/server
```

This ensures the dependency is added only to the server package.
