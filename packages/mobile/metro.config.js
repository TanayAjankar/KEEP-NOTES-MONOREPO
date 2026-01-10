const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration for monorepo setup
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [
    // Add the monorepo root to watch folders
    path.resolve(__dirname, '../..'),
  ],
  resolver: {
    // Enable symlinks to work with pnpm
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android', 'native', 'web'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
