const path = require('path');

// We have locally installed RxJS@7, which has breaking changes compared to RxJS@6.
// For instance, operators can be imported directly from `rxjs`. RxJS@6 operators can be
// imported only from `rxjs/operators`. This Webpack config aliases locally installed RxJS@7 to
// RxJS@6 to ensure that no operators are imported from `rxjs`; the build will fail.
// This might happen when some IDE (like VSCode) autocompletes imports for RxJS operators.

module.exports = (config, options, { target }) => {
  if (target === 'build-rxjs-6') {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Note: `require.resolve` will resolve to `node_modules/.pnpm` folder.
      rxjs: path.join(__dirname, '../../node_modules/rxjs-6'),
    };
  }

  return config;
};
