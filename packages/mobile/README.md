# Keep Notes Mobile App

React Native mobile application for the Keep Notes project.

## Development

Make sure you have set up your development environment for React Native by following the official guide:
https://reactnative.dev/docs/set-up-your-environment

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Install Dependencies

From the root of the monorepo:
```bash
pnpm install
```

### Running the App

#### Start Metro Server
```bash
cd packages/mobile
pnpm start
```

#### For Android
```bash
cd packages/mobile
pnpm android
```

#### For iOS (macOS only)
```bash
cd packages/mobile
pnpm ios
```

### Scripts

- `pnpm start` - Start Metro bundler
- `pnpm android` - Run on Android emulator/device
- `pnpm ios` - Run on iOS simulator/device
- `pnpm lint` - Run ESLint
- `pnpm test` - Run Jest tests

## Features

This mobile app will provide:
- Note creation and editing
- Synchronization with the server
- Offline support
- User authentication

## Project Structure

```
packages/mobile/
├── android/           # Android-specific files
├── ios/               # iOS-specific files
├── __tests__/         # Test files
├── App.jsx            # Main app component
├── index.js           # Entry point
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Monorepo Integration

This mobile app is part of the Keep Notes monorepo and can share code with other packages:
- `shared` - Shared utilities and types
- `server` - Backend API server

## Getting Started

1. Follow the React Native environment setup guide
2. Install dependencies from the monorepo root: `pnpm install`
3. Start Metro: `cd packages/mobile && pnpm start`
4. Run on your preferred platform: `pnpm android` or `pnpm ios`
