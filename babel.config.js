/* eslint-disable no-sparse-arrays */

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@euc-tricorder/core': './src/core',
          '@euc-tricorder/types': './src/types',
          '@euc-tricorder/adapters': './src/adapters',
          '@euc-tricorder/providers': './src/providers',
          '@euc-tricorder/routes': './src/routes',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
