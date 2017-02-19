#!/usr/bin/env node
"use strict";

const Liftoff = require("liftoff");
const imconfly = require("../app");

const MyApp = new Liftoff({
  name: 'imconfly',
  configName: 'imconfile',
  extensions: {
    '.js': null,
    '.json': null
  }
});

function invoke(env) {
  if (!env.configPath) {
    console.error("No configuration file found.");
    process.exit(2);
  }
  console.log(`Configuration module: ${env.configPath}`);
  const c = imconfly.conf.Conf.fromFile(env.configPath);
  const app = new imconfly.Imconfly(c);
  app.listen();
  console.log(`Storage root: ${app.conf.storageRoot}`);
  console.log(`listening on port ${app.conf.port}`);
}

MyApp.launch({}, invoke);
