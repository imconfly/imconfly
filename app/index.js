"use strict";

const WRONG_REQUEST_FORMAT =
  `HTTP 404 - Not Found.\n\nThe format of the requested url don't match the current Imconfly configuration.`;

const fs = require("fs");
const http = require("http");
const path = require("path");
const exec = require("child_process").exec;
const mkdirp = require("mkdirp");
const request = require("request");
const nodeStatic = require("node-static");
const context = require("./context");


/**
 *
 * @property {conf.Conf}          conf
 * @property {nodeStatic.Server}  staticServer
 */
class Imconfly {
  /**
   *
   * @param {conf.Conf} conf
   */
  constructor(conf) {
    this.conf = conf;
    this.staticServer = new nodeStatic.Server(conf.storageRoot);
  }

  /**
   *
   * @param {context.Context} ctx
   * @param {function} callback
   */
  action(ctx, callback) {
    if (ctx.transform === null) {
      return this.getOrigin(ctx, callback);
    }

    this.getOrigin(ctx, err => {
      if (err) return callback(err);

      let source = ctx.originLocalPath;
      let dest = ctx.transformPath;

      mkdirp(path.dirname(dest), err => {
        if (err) return callback(err);

        let transform = ctx.transformAction
          .replace('{source}', source)
          .replace('{destination}', dest);

        exec(transform, (error, stdout, stderr) => {
          if (error) {
            console.error('Exit code:', error.code);
            console.error('Program output:', stdout);
            console.error('Program stderr:', stderr);
            return callback(error);
          }
          callback();
        });
      });
    });
  }

  /**
   *
   * @param {context.Context} ctx
   * @param {function} callback
   */
  getOrigin(ctx, callback) {
    fs.stat(ctx.originLocalPath, (err, stats) => {
      if (!err && stats.isFile()) return callback();

      //console.log(ctx);
      request.get(ctx.originRemoteURL, {encoding: 'binary'}, (err, response, body) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        if (response.statusCode != 200) {
          callback(new Error(`Response status code is ${response.statusCode}`));
        } else {
          mkdirp(path.dirname(ctx.originLocalPath), err => {
            if (err) return callback(err);
            fs.writeFile(ctx.originLocalPath, body, 'binary', callback);
          });
        }
      });
    });
  }

  listen() {
    return http.createServer((request, response) => {
      request.addListener('end', () => {
        this.staticServer.serve(request, response, e => {
          if (!e) return;

          if (e.status == 404) {
            let ctx;
            try {
              ctx = new context.Context(this.conf, request.url);
            } catch (err) {
              response.writeHead(404, {'Content-Type': 'text/plain'});
              response.end(WRONG_REQUEST_FORMAT);
              return;
            }

            this.action(ctx, err => {
              if (err) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end(`HTTP 404 - Not Found. (Request to origin error: ${err.message})`);
                return;
              }
              this.staticServer.serveFile(request.url, 200, {}, request, response);
            });
          } else {
            response.writeHead(e.status, {'Content-Type': 'text/plain'});
            response.end(e.message);
          }
        });
      }).resume();
    }).listen(this.conf.port);
  }
}

module.exports = Imconfly;
