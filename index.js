#!/usr/bin/env node

// todo: this is a very bad implementation, i want streams-based solution!

const CONF = {
  storage_root: `${__dirname}/STORAGE`,
  port: 9988,
  containers: {
    vek: {
      root: 'http://www.vek-dverey.ru/media',
      transforms: {
        square_200x200: 'convert {source} -resize 200x200 -background white -gravity center -extent 200x200 {destination}'
      }
    }
  }
};

const mkdirp = require('mkdirp');
const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');
const nodeStatic = require('node-static');
const shell = require('shelljs');

mkdirp.sync(CONF.storage_root);

// request: {service_url}/vek/square_200x200/klin/impex1.png

var staticServer = new nodeStatic.Server(CONF.storage_root);

http.createServer(function(request, response) {
  request.addListener('end', function () {
    staticServer.serve(request, response, function (e, res) {
      if (e && e.status == 404) {
        try {
          var r = requestParser(request);
        } catch (err) {
          response.writeHead(404, {"Content-Type": "text/plain"});
          response.write('HTTP 404 - Not Found');
          response.end();
          return;
        }
        action(r, function(err) {
          if (err) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write(`HTTP 404 - Not Found. (Request to origin error: ${err.message})`);
            response.end();
          } else {
            var relative = r.locals[r.transName].replace(CONF.storage_root, '');
            staticServer.serveFile(relative, 200, {}, request, response);
          }
        });
      }
    });
  }).resume();
}).listen(CONF.port);

function requestParser(request) {
  // requestInfo
  var r = {};

  var parts = request.url.split('/');
  r.container = parts[1];
  r.transName = parts[2];
  r.relativePath = '/' + parts.slice(3, parts.lenght).join('/');
  r.origin = CONF.containers[r.container].root + r.relativePath;

  if (r.transName == 'origin') {
    r.transform = 'origin';
  } else {
    r.transform = CONF.containers[r.container].transforms[r.transName];
  }

  if (!(r.container && r.transName && r.relativePath && r.transform)) {
    throw new Error();
  }

  r.locals = {};
  r.locals.origin = `${CONF.storage_root}/${r.container}/origin${r.relativePath}`;
  r.locals[r.transName] = `${CONF.storage_root}/${r.container}/${r.transName}${r.relativePath}`;

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
  if (fileExists(r.locals.origin)) {
    callback();
  }
  request.get(r.origin, {encoding: 'binary'}, function (err, response, body) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    if (response.statusCode != 200) {
      return callback(new Error(`Response status code is ${response.statusCode}`));
    }
    var dirname = path.dirname(r.locals.origin);
    mkdirp(dirname, function(err) {
      if (err) {
        callback(err);
      }
      fs.writeFile(r.locals.origin, body, 'binary', function (err) {
        if (err) {
          callback(err);
        }
        callback();
      });
    });
  });
}

function fileExists(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (err) {
    return false;
  }
}
