"use strict";

const DEFAULT_STORAGE_DIRNAME = "imconfly_storage";
const DEFAULT_PORT = 9989;
const DEFAULT_URL_CHECK = /^[\w./_-]+$/;

const fs = require("fs");
const path = require("path");
const common = require("./common");

/**
 * Configuration object
 *
 * @property {string} workdir
 * @property {string} storageRoot
 * @property {number} port
 * @property {object} urlChecker
 * @property {Array}  containers
 */
class Conf {
  /**
   *
   * @param {Object} obj
   * @param {string} workdir
   * @throws {ConfError}
   */
  constructor(obj, workdir) {
    // this.workdir
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

    // this.storageRoot
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

    // this.port
    if (obj.port === undefined) {
      this.port = DEFAULT_PORT
    } else if (typeof obj.port !== "number") {
      throw new ConfError(`"port" param is not a number`);
    } else {
      this.port = obj.port;
    }

    // this.urlChecker
    if (obj.urlChecker === undefined) {
      this.urlChecker = DEFAULT_URL_CHECK;
    } else {
      if (typeof obj.urlChecker === "object") {
        this.urlChecker = obj.urlChecker;
      } else if (typeof obj.urlChecker === "string") {
        let match = obj.urlChecker.match(new RegExp('^/(.*?)/([gimy]*)$'));
        this.urlChecker = new RegExp(match[1], match[2]);
      } else {
        throw new ConfError('"urlChecker" param is not a regexp or string');
      }
    }

    // this.containers
    if (obj.containers === undefined) {
      throw new ConfError(`"containers" param missed`);
    }
    if (typeof obj.containers !== "object") {
      throw new ConfError(`"containers" param is not an object`);
    }
    if (Object.keys(obj.containers).length === 0) {
      throw new ConfError(`"containers" param is an empty object`);
    }
    this.containers = {};
    for (let key of Object.keys(obj.containers)) {
      let container = obj.containers[key];
      if (container.root === undefined) {
        throw new ConfError(`param "root" not found in container ${key}`)
      }
      if (typeof container.root !== "string") {
        throw new ConfError(`param "root" in container ${key} is not a string`)
      }
      this.containers[key] = {root: container.root};
      if (container.transforms !== undefined && Object.keys(container.transforms).length > 0) {
        this.containers[key].transforms = container.transforms;
      }
    }
  }

  /**
   * Fabric method
   *
   * @param {string} filePath
   * @returns {Conf}
   * @throws {ConfError}
   */
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
