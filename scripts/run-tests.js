require('@babel/register');
require('@babel/polyfill');
const Window = require('window');

const path = require('path');
const glob = require('glob');

process.argv.slice(2).forEach(arg => {
  glob(arg, (error, files) => {
    if (error) {
      throw error;
    } else {
      // Create fake window (& other) objects.
      window = new Window();
      Image = window.Image;
      document = window.document;
      navigator = window.navigator;

      // Process each file.
      files.forEach(file => {
        return require(path.resolve(process.cwd(), file));
      });
    }
  });
});
