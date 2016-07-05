#!/usr/bin/env node
'use strict';

// todo: SAFETY CHECK!
// todo: params for transforms validation

const WRONG_REQUEST_FORMAT = 'HTTP 404 - Not Found.\n' +
                             'The format of the requested url don\'t match the current Imconfly configuration.';

const DEFAULT_URL_CHECK = /^[\w\./_-]+$/;

const fs = require('fs');
const http = require('http');
const path = require('path');

const mkdirp = require('mkdirp');
const request = require('request');
const nodeStatic = require('node-static');
const shell = require('shelljs');

function Imconfly(conf) {
  if (!(this instanceof Imconfly)) {
    return new Imconfly(conf);
  }

  this.conf = conf;
  this.staticServer = new nodeStatic.Server(conf.storageRoot);
}

Imconfly.prototype.urlParser = function(url) {
  var checker = this.conf.urlChecker || DEFAULT_URL_CHECK;
  if (!checker.test(url)) {
    throw new Error(`Requested URL "${url}" not match "${checker}"`);
  }

  // requestInfo
  var r = {};

  var parts = url.split('/');
  r.container = parts[1];
  r.transName = parts[2];

  var requestedPath = path.sep + parts.slice(3, parts.lenght).join(path.sep);
  if (requestedPath == '/') {
    throw new Error('No relative path in URL');
  }
  r.relativePath = path.normalize(requestedPath);
  if (requestedPath != r.relativePath) {
    throw new Error('Bad path');
  }

  r.origin = this.conf.containers[r.container].root + r.relativePath;

  if (r.transName == 'origin') {
    r.transform = 'origin';
  } else {
    r.transform = this.conf.containers[r.container].transforms[r.transName];
  }

  if (!(r.container && r.transName && r.relativePath && r.transform)) {
    throw new Error();
  }

  var originPath = path.join(this.conf.storageRoot, r.container, 'origin' + r.relativePath);
  var transformPath = path.join(this.conf.storageRoot, r.container, r.transName + r.relativePath);

  r.locals = {};
  r.locals.origin = originPath;
  r.locals[r.transName] = transformPath;

  return r;
};


Imconfly.prototype.action = function (r, callback) {
  if (r.transName === 'origin') {
    this.getOrigin(r, callback);
  } else {
    this.getOrigin(r, err => {
      if (err) return callback(err);

      var source = r.locals.origin;
      var dest = r.locals[r.transName];
      var destDirname = path.dirname(dest);
      mkdirp(destDirname, err => {
        if (err) return callback(err);
        var transform = r.transform.replace('{source}', source).replace('{destination}', dest);
        shell.exec(transform, {async: true, silent: true}, (code, stdout, stderr) => {
          if (code) {
            console.error('Exit code:', code);
            console.error('Program output:', stdout);
            console.error('Program stderr:', stderr);
            callback(new Error(`${code}: ${stderr}`));
            return;
          }
          callback();
        });
      });
    });
  }
};

Imconfly.prototype.getOrigin = function (r, callback) {
  fs.stat(r.locals.origin, (err, stats) => {
    if (!err && stats.isFile()) return callback();

    request.get(r.origin, {encoding: 'binary'}, (err, response, body) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      if (response.statusCode != 200) {
        callback(new Error(`Response status code is ${response.statusCode}`));
      } else {
        mkdirp(path.dirname(r.locals.origin), (err) => {
          if (err) return callback(err);
          fs.writeFile(r.locals.origin, body, 'binary', callback);
        });
      }
    });
  });
};

Imconfly.prototype.listen = function() {
  return http.createServer((request, response) => {
    request.addListener('end', () => {
      this.staticServer.serve(request, response, e => {
        if (e) {
          if (e.status == 404) {
            try {
              var r = this.urlParser(request.url);
            } catch (err) {
              response.writeHead(404, {'Content-Type': 'text/plain'});
              response.end(WRONG_REQUEST_FORMAT);
              return;
            }
            this.action(r, err => {
              if (err) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end(`HTTP 404 - Not Found. (Request to origin error: ${err.message})`);
                return;
              }
              var relative = r.locals[r.transName].replace(this.conf.storageRoot, '');
              this.staticServer.serveFile(relative, 200, {}, request, response);
            });
          } else {
            response.writeHead(e.status, {'Content-Type': 'text/plain'});
            response.end(e.message);
          }
        }
      });
    }).resume();
  }).listen(this.conf.port);
};

if (!module.parent) {
  let conf = require('./conf/index.js');
  let app = Imconfly(conf);
  app.listen();
  console.log(`listening on port ${conf.port}`);
} else {
  module.exports = Imconfly;
}
