/**
 * to prevent file update changes from not failing
 */

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
