const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './js/script.js',
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js',
  }
};