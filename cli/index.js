#!/usr/bin/env node
"use strict";

const path = require("path");
const Liftoff = require("liftoff");
const Imconfly = require("../app");
const conf = require("../app/conf");

const MyApp = new Liftoff({
  name: 'imconfly',
  configName: 'imconfile',
  extensions: {
    '.js': null,
    '.json': null
  }
});

function invoke(env) {
  const imconfile = env.configPath;
  console.log(`Configuration module: ${imconfile}`);
  const c = conf.Conf.fromFile(imconfile);
  const app = new Imconfly(c);
  app.listen();
  console.log(`Storage root: ${app.conf.storageRoot}`);
  console.log(`listening on port ${app.conf.port}`);
}

MyApp.launch({}, invoke);
