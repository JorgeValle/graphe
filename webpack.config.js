const path = require('path');

module.exports = {
  entry: './front/assets/scripts/index.js',
  output: {
    path: path.resolve(__dirname, './front/assets/'),
    filename: 'bundle.js'
  }
};