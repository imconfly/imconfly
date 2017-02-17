"use strict";

const path = require("path");
const common = require("./common");

/**
 * Structured info about the request, based on given conf
 *
 * @property {string}      container
 * @property {string|null} transform         null if "origin" is the second part of the given URL
 * @property {string|null} transformPath     path to local file, or null if 'transform' property is null
 * @property {string|null} transformAction   external command with "{source}" and "{destination}" placeholders
 * @property {array}       relative          ['a', 'b', 'c'] if relative part of the given URL is 'a/b/c'
 * @property {boolean}     originIsLocal     true if origin is local, overwise false
 * @property {string}      originLocalPath   path to local origin file
 * @property {string|null} originRemoteURL   URL to origin file, or null if 'originIsLocal' property is true
 */
class Context {
  /**
   * @param  {conf.Conf}     conf
   * @param  {string}        url
   * @throws {ContextError}
   */
  constructor(conf, url) {
  	this.conf = conf;
  	this.url = url;

    if (!conf.urlChecker.test(url)) {
      throw new ContextFormatError(`Requested URL "${url}" don't match "${conf.urlChecker}"`);
    }

    const parts = url.split('/');
    if (parts.length < 4) {
      throw new ContextFormatError(`Wrong request format: "${url}"`);
    }

    this.container = parts[1];
    if (conf.containers[this.container] === undefined) {
      throw new ContextBadTransformError();
    }

    if (parts[2] == 'origin') {
      this.transform = null;
      this.transformPath = null;
      this.transformAction = null;
    } else {
      this.transform = parts[2];
      if (conf.containers[this.container].transforms[this.transform] === undefined) {
        throw new ContextBadTransformError();
      }
    }

    this.relative = parts.slice(3);

    if (conf.containers[this.container].root.startsWith('http')) {
      this.originIsLocal = false;
      this.originRemoteURL = conf.containers[this.container].root + '/' + this.relative.join('/');
    } else {
      this.originIsLocal = true;
      this.originRemoteURL = null;
    }

    this.originLocalPath = path.resolve(
      conf.storageRoot,
      this.container,
      parts[2],
      this.relative.join(path.sep)
    );

    // check for a/b/../../../../c
    const pathCheck = [conf.storageRoot, this.container, parts[2], this.relative.join(path.sep)].join(path.sep);
    if (this.originLocalPath !== pathCheck) {
      throw new ContextFormatError();
    }
  }
}

/**
 * Common error for Context
 *
 */
class ContextError extends common.ImconflyError {
  constructor(message) {
  	super(message);
  }
}

/**
 * Error in format of the request
 *
 */
class ContextFormatError extends ContextError {
  constructor(message) {
    super(message);
  }
}

/**
 * This error throws if given container/transform don`t corresponding to
 * current configuration.
 *
 */
class ContextBadTransformError extends ContextError {
  constructor(message) {
    super(message);
  }
}

exports.Context = Context;
exports.ContextError = ContextError;
exports.ContextFormatError = ContextFormatError;
exports.ContextBadTransformError = ContextBadTransformError;
