module.exports = {
  displayName: 'until-destroy integration',
  testMatch: ['<rootDir>/integration/app/**/*.spec.ts'],
  moduleNameMapper: {
    '@ngneat/until-destroy': '<rootDir>/src'
  },
  cacheDirectory: '<rootDir>/.cache',
  bail: true,
  clearMocks: true,
  resetModules: true
};
