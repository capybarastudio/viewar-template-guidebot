const merge = require('webpack-merge');

const common = require('./common.config');
const production = require('./production.config');
const develop = require('./develop.config');

module.exports = env => {
  if (env === 'production') {
    console.log('[ViewAR] Using production mode.');
    return merge(common.config, production.config);
  }

  const developConfig = merge(common.config, develop.config);
  if (env === 'development_mock') {
    console.log('[ViewAR] Using development mock mode.');
    return merge(developConfig, develop.mock);
  }

  console.log('[ViewAR] Using development core mode.');
  return merge(developConfig, develop.core);
};
