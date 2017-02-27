"use strict";

const DEFAULT_STORAGE_DIRNAME = exports.DEFAULT_STORAGE_DIRNAME = "imconfly_storage";
const DEFAULT_PORT = exports.DEFAULT_PORT = 9989;
const DEFAULT_URL_CHECK = exports.DEFAULT_URL_CHECK = /^[\w./_-]+$/;
const DAY_SECONDS = 86400;
const DEFAULT_MAXAGE = exports.DEFAULT_MAXAGE = DAY_SECONDS * 31;

const fs = require("fs");
const path = require("path");
const common = require("./common");

/**
 * Configuration object
 *
 * @property {string} workDir
 * @property {string} storageRoot
 * @property {number} port
 * @property {object} urlChecker
 * @property {Array}  containers
 */
class Conf {
  /**
   *
   * @param  {Object}      obj
   * @param  {string}      workDir
   * @throws {ConfError}
   */
  constructor(obj, workDir) {
    if (!obj || typeof obj !== "object") {
      throw new ConfError("Given conf is not an object");
    }

    this.workDir = this._workDir(workDir);
    this.storageRoot = this._storageRoot(obj);
    this.port = this._port(obj);
    this.urlChecker = this._urlChecker(obj);
    this.containers = this._containers(obj);
    this.maxage = this._maxage(obj);
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

  _maxage(obj) {
    if (obj.maxage === undefined) {
      return DEFAULT_MAXAGE
    }
    if (typeof obj.maxage !== "number") {
      throw new ConfError(`"maxage" param is not a number`);
    }

    return obj.maxage;
  }

  _workDir(workDir) {
    let st;
    try {
      st = fs.statSync(workDir);
    } catch (e) {
      throw new ConfError(`"${workDir}" no such file or directory`);
    }
    if (!st.isDirectory()) {
      throw new ConfError(`"${workDir}" is not a directory`);
    }

    return path.resolve(workDir);
  }

  _storageRoot(obj) {
    if (obj.storageRoot === undefined) {
      return path.resolve(this.workDir, DEFAULT_STORAGE_DIRNAME);
    }

    if (typeof obj.storageRoot !== "string") {
      throw new ConfError(`"storageRoot" param is not a string`);
    }
    if (obj.storageRoot.length === 0) {
      throw new ConfError(`"storageRoot" param is an empty string`);
    }

    return path.resolve(obj.storageRoot);
  }

  _port(obj) {
    if (obj.port === undefined) {
      return DEFAULT_PORT
    }
    if (typeof obj.port !== "number") {
      throw new ConfError(`"port" param is not a number`);
    }

    return obj.port;
  }

  _urlChecker(obj) {
    if (obj.urlChecker === undefined) {
      return DEFAULT_URL_CHECK;
    }

    if (typeof obj.urlChecker === "object") {
      return obj.urlChecker;
    }

    if (typeof obj.urlChecker === "string") {
      let match = obj.urlChecker.match(new RegExp('^/(.*?)/([gimy]*)$'));
      return new RegExp(match[1], match[2]);
    } else {
      throw new ConfError('"urlChecker" param is not a regexp or string');
    }
  }

  _containers(obj) {
    if (obj.containers === undefined) {
      throw new ConfError(`"containers" param missed`);
    }
    if (typeof obj.containers !== "object") {
      throw new ConfError(`"containers" param is not an object`);
    }
    if (Object.keys(obj.containers).length === 0) {
      throw new ConfError(`"containers" param is an empty object`);
    }

    let containers = {};
    for (let key of Object.keys(obj.containers)) {
      let container = obj.containers[key];
      if (container.root === undefined) {
        throw new ConfError(`param "root" not found in container ${key}`)
      }
      if (typeof container.root !== "string") {
        throw new ConfError(`param "root" in container ${key} is not a string`)
      }
      containers[key] = {root: container.root};
      if (container.transforms !== undefined && Object.keys(container.transforms).length > 0) {
        containers[key].transforms = container.transforms;
      }
    }
    return containers;
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
