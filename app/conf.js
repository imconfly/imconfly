"use strict";

const DEFAULT_STORAGE_DIRNAME = "imconfly_storage";
const DEFAULT_PORT = 9989;
const DEFAULT_URL_CHECK = /^[\w./_-]+$/;

const fs = require("fs");
const path = require("path");
const common = require("./common");

// {
//   storageRoot: path.resolve(__dirname, '..', '..', 'TEST_STORAGE'),
//   port: 9989,
//   containers: {
//     nodejs: {
//       root: 'https://nodejs.org/static/images/logos',
//       transforms: {
//         dummy: 'cp "{source}" "{destination}"'
//       }
//     },
//     local: {
//       root: path.join(__dirname, 'support', 'LOCAL_ORIGIN'),
//       transforms: {
//         dummy: 'cp "{source}" "{destination}"'
//       }
//     }
//   }
// };


class Conf {
  constructor(obj, workdir) {
    let st;
    try {
      st = fs.statSync(workdir);
    } catch (e) {
      throw new ConfError(`"${workdir}" no such file or directory`);
    }
    if (!st.isDirectory()) {
      throw new ConfError(`"${workdir}" is not a directory`);
    }

    this.workdir = path.resolve(workdir);

    if (!obj || typeof obj !== "object") {
      throw new ConfError("Given conf is not an object");
    }
    if (obj.storageRoot === undefined) {
      this.storageRoot = path.resolve(this.workdir, DEFAULT_STORAGE_DIRNAME);
    } else {
      if (typeof obj.storageRoot !== "string") {
        throw new ConfError(`"storageRoot" param is not a string`);
      }
      if (obj.storageRoot.length === 0) {
        throw new ConfError(`"storageRoot" param is an empty string`);
      }
      this.storageRoot = path.resolve(obj.storageRoot);
    }
  }

  static fromFile(filePath) {
    let dirname = path.dirname(filePath);
    let obj = require(filePath);
    return new Conf(obj, dirname);
  }
}

/**
 * Common error for Conf
 *
 */
class ConfError extends common.ImconflyError {
  constructor(message) {
    super(message);
  }
}

exports.Conf = Conf;
exports.ConfError = ConfError;
