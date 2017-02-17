"use strict";

const path = require("path");

exports.TEST_CONF_FILE = path.resolve(__dirname, "data", "conf_test_from_file.json");

// conf parts
exports.CONF_STORAGE_ROOT = path.resolve(__dirname, "TEST_STORAGE");
exports.CONF_PORT = 9989;
exports.CONF_CONTAINER_REMOTE = "nodejs";
exports.CONF_CONTAINER_LOCAL = "local";
exports.CONF_ORIGIN_REMOTE = "https://nodejs.org/static/images/logos";
exports.CONF_ORIGIN_LOCAL = path.join(__dirname, "data", "LOCAL_ORIGIN");
exports.CONF_TRANSFORM_NAME = "dummy";
exports.CONF_TRANSFORM_ACTION = `cp "{source}" "{destination}"`;
exports.CONF_TRANSFORMS = {dummy: exports.CONF_TRANSFORM_ACTION};

// conf for all tests
exports.CONF = {
  storageRoot: exports.CONF_STORAGE_ROOT,
  port: exports.CONF_PORT,
  containers: {
    nodejs: {
      root: exports.CONF_ORIGIN_REMOTE,
      transforms: exports.CONF_TRANSFORMS
    },
    local: {
      root: exports.CONF_ORIGIN_LOCAL,
      transforms: exports.CONF_TRANSFORMS
    }
  }
};

// -------------------- remote

exports.RELATIVE_REMOTE = "nodejs-1024x768.png";

// urls
exports.URL_TRANSFORM_REMOTE = `/${exports.CONF_CONTAINER_REMOTE}/${exports.CONF_TRANSFORM_NAME}/${exports.RELATIVE_REMOTE}`;
exports.URL_ORIGIN_REMOTE = `/${exports.CONF_CONTAINER_REMOTE}/origin/${exports.RELATIVE_REMOTE}`;

// calculated values
exports.CALCULATED_ORIGIN_PATH_REMOTE = path.resolve(
  exports.CONF_STORAGE_ROOT,
  exports.CONF_CONTAINER_REMOTE,
  "origin",
  exports.RELATIVE_REMOTE
);
exports.CALCULATED_ORIGIN_URL_REMOTE = `${exports.CONF_ORIGIN_REMOTE}/${exports.RELATIVE_REMOTE}`;
exports.CALCULATED_TRANSFORM_PATH_REMOTE = path.resolve(
  exports.CONF_STORAGE_ROOT,
  exports.CONF_CONTAINER_REMOTE,
  exports.CONF_TRANSFORM_NAME,
  exports.RELATIVE_REMOTE
);

// -------------------- local

exports.RELATIVE_LOCAL = ["folder1", "folder2", "hello.txt"];

// urls
exports.URL_TRANSFORM_LOCAL = `/${exports.CONF_CONTAINER_LOCAL}/${exports.CONF_TRANSFORM_NAME}/${exports.RELATIVE_LOCAL.join("/")}`;
exports.URL_ORIGIN_LOCAL = `/${exports.CONF_CONTAINER_LOCAL}/origin/${exports.RELATIVE_LOCAL.join("/")}`;

// calculated values
exports.CALCULATED_ORIGIN_PATH_LOCAL = path.resolve(
  exports.CONF_ORIGIN_LOCAL,
  path.join(...exports.RELATIVE_LOCAL)
);
exports.CALCULATED_TRANSFORM_PATH_LOCAL = path.resolve(
  exports.CONF_STORAGE_ROOT,
  exports.CONF_CONTAINER_LOCAL,
  exports.CONF_TRANSFORM_NAME,
  path.join(...exports.RELATIVE_LOCAL)
);
