const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};

const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'src');
const buildPath = path.join(root, 'build');

const getViewARConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(`${__dirname}/../.viewar-config`));
  } catch (e) {
    console.error(
      '[ViewAR] ERROR: File .viewar-config not existing or invalid JSON format.'
    );
    return {};
  }
};

// Webpack-dev-server's before function to receive remote console output.
const before = app => {
  const colors = {
    log: 'white',
    info: 'white',
    warn: 'yellow',
    error: 'red',
  };

  app.use(bodyParser.json());
  app.post('/remote-console', bodyParser.json(), function(req, res) {
    const { type, args } = req.body;
    const time = new Date().toLocaleTimeString();
    console[type](`[${time}][App]` + chalk[colors[type]](`[${type}]`), ...args);
    res.send();
  });
};

module.exports = {
  setFreeVariable,
  srcPath,
  buildPath,
  getViewARConfig,
  before,
};
