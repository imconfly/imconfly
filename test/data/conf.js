"use strict";

const path = require("path");

module.exports = {
  storageRoot: path.resolve(__dirname, "..", "..", "TEST_STORAGE"),
  port: 9989,
  containers: {
    nodejs: {
      root: "https://nodejs.org/static/images/logos",
      transforms: {
        dummy: `cp "{source}" "{destination}"`
      }
    },
    local: {
      root: path.join(__dirname, "support", "LOCAL_ORIGIN"),
      transforms: {
        dummy: `cp "{source}" "{destination}"`
      }
    }
  }
};
