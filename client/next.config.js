module.exports = {
  env: {
    STRIPE_KEY: process.env.STRIPE_KEY,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
