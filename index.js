#!/usr/bin/env node

const CONTAINERS = {
  vek: {
    root: 'http://www.vek-dverey.ru',
    transforms: {
      big: 'big',
      medium: 'medium',
      small: 'small'
    }
  }
}

const PORT = 9988;
const STORAGE_ROOT = `${__dirname}/STORAGE`;

const mkdirp = require('mkdirp');
const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');
const static = require('node-static');

mkdirp.sync(STORAGE_ROOT);

// request: {service_url}/vek/big/klin/impex1.png

var staticServer = new static.Server(STORAGE_ROOT);

http.createServer(function(request, response) {
  request.addListener('end', function () {
    staticServer.serve(request, response, function (e, res) {
        if (e && (e.status === 404)) {
          try {
            r = requestParser(request)
          } catch (err) {
            console.log(err);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write('HTTP 404 - Not Found');
            response.end();
            return;
          }
          action(r);
          // response.writeHead(200, {"Content-Type": "text/plain"});
          // response.write('dummy');
          // response.end();
          relative = r.locals[r.transName].replace(STORAGE_ROOT, '');
          console.log(relative);
          staticServer.serveFile(relative, 200, {}, request, response);
        }
    });
  }).resume();
}).listen(PORT);

function requestParser(request) {
  // requestInfo
  var r = {}

  var parts = request.url.split('/')
  r.container = parts[1];
  r.transName = parts[2];
  r.relativePath = '/' + parts.slice(3, parts.lenght).join('/');
  r.origin = CONTAINERS[r.container].root + r.relativePath;

  if (r.transName == 'origin') {
    r.transform = 'origin';
  } else {
    r.transform = CONTAINERS[r.container].transforms[r.transName];
  }

  console.log(r);
  if (!(r.container && r.transName && r.relativePath && r.transform)) {
    throw new Error();
  }

  r.locals = {}
  r.locals.origin = `${STORAGE_ROOT}/${r.container}/origin${r.relativePath}`;
  r.locals[r.transName] = `${STORAGE_ROOT}/${r.container}/${r.transName}${r.relativePath}`;

  return r;
}

function action(r) {
  console.log(r);
  if (r.transName === 'origin') {
    console.log('Original img');
    pipe = getOrigin(r);
  }
}

function getOrigin(r) {
  if (fileExists(r.locals.origin)) {
    console.log('file exist');
  } else {
    dirname = path.dirname(r.locals.origin);
    mkdirp.sync(dirname);
    request(r.origin).pipe(
      fs.createWriteStream(r.locals.origin)
    );
    console.log('file created');
  }
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err) {
    return false;
  }
}
