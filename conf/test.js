'use strict';

var path = require('path');

module.exports = {
  storageRoot: path.normalize(`${__dirname}/../TEST_STORAGE`),
  port: 9989,
  containers: {
    nodejs: {
      root: 'https://nodejs.org/static/images/logos',
      transforms: {
        square_200x200: 'cp "{source}" "{destination}"'
      }
    }
  }
};
