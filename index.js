#!/usr/bin/env node

// todo: SAFETY CHECK!
// todo: params for transforms validation
// todo: this is a very bad implementation, i want a streams-based solution

var conf = require('./conf/test');

const mkdirp = require('mkdirp');
const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');
const nodeStatic = require('node-static');
const shell = require('shelljs');

// request: {service_url}/vek/square_200x200/klin/impex1.png

var staticServer = new nodeStatic.Server(conf.storage_root);

http.createServer(function(request, response) {
  request.addListener('end', function () {
    staticServer.serve(request, response, function (e, res) {
      if (e && e.status == 404) {
        try {
          var r = requestParser(request);
        } catch (err) {
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.end('HTTP 404 - Not Found');
          return;
        }
        action(r, function(err) {
          if (err) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.end(`HTTP 404 - Not Found. (Request to origin error: ${err.message})`);
          } else {
            var relative = r.locals[r.transName].replace(conf.storage_root, '');
            staticServer.serveFile(relative, 200, {}, request, response);
          }
        });
      }
    });
  }).resume();
}).listen(conf.port);

function requestParser(request) {
  // requestInfo
  var r = {};

  var parts = request.url.split('/');
  r.container = parts[1];
  r.transName = parts[2];
  r.relativePath = '/' + parts.slice(3, parts.lenght).join('/');
  r.origin = conf.containers[r.container].root + r.relativePath;

  if (r.transName == 'origin') {
    r.transform = 'origin';
  } else {
    r.transform = conf.containers[r.container].transforms[r.transName];
  }

  if (!(r.container && r.transName && r.relativePath && r.transform)) {
    throw new Error();
  }

  r.locals = {};
  r.locals.origin = `${conf.storage_root}/${r.container}/origin${r.relativePath}`;
  r.locals[r.transName] = `${conf.storage_root}/${r.container}/${r.transName}${r.relativePath}`;

  return r;
}

function action(r, callback) {
  if (r.transName === 'origin') {
    getOrigin(r, callback);
  } else {
    getOrigin(r, function(err) {
      if (err) {
        callback(err);
        return;
      }
      var source = r.locals.origin;
      var dest = r.locals[r.transName];
      var destDirname = path.dirname(dest);
      mkdirp(destDirname, function(err) {
        if (err) {
          callback(err);
        }
        var transform = r.transform.replace('{source}', source).replace('{destination}', dest);
        // *******************************
        // * 99.9% of perfomance is here *
        // *******************************
        shell.exec(transform, {async: true, silent: true}, function(code, stdout, stderr) {
          if (code) {
            console.error('Exit code:', code);
            console.error('Program output:', stdout);
            console.error('Program stderr:', stderr);
            callback(new Error(`${code}: ${stderr}`));
          }
          callback();
        });
      });
    });
  }
}

function getOrigin(r, callback) {
  fs.stat(r.locals.origin, function(err, stats) {
    if (!err && stats.isFile()) {
      callback();
    } else {
      request.get(r.origin, {encoding: 'binary'}, function(err, response, body) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        if (response.statusCode != 200) {
          callback(new Error(`Response status code is ${response.statusCode}`));
        } else {
          mkdirp(path.dirname(r.locals.origin), function(err) {
            if (err) {
              callback(err);
            } else {
              fs.writeFile(r.locals.origin, body, 'binary', function (err) {
                callback(err);
              });
            }
          });
        }
      });
    }
  });
}
