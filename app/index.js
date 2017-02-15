"use strict";

const WRONG_REQUEST_FORMAT =
`HTTP 404 - Not Found.
The format of the requested url don't match the current Imconfly configuration.`;

const fs = require("fs");
const http = require("http");
const path = require("path");

const mkdirp = require("mkdirp");
const request = require("request");
const nodeStatic = require("node-static");
const exec = require("child_process").exec;

class Imconfly {
  constructor(conf) {
    this.conf = conf;
    this.staticServer = new nodeStatic.Server(conf.storageRoot);
  }
}
