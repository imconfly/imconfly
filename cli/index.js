#!/usr/bin/env node
'use strict';

const path = require('path');

const Liftoff = require('liftoff');
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
  const conf = require(imconfile);
  if(conf.storageRoot.startsWith('.')) {
    conf.storageRoot = path.resolve(env.cwd, conf.storageRoot);
  }
  const app = require('../app')(conf);
  app.listen();
  console.log(`Storage root: ${app.conf.storageRoot}`);
  console.log(`listening on port ${app.conf.port}`);
}

MyApp.launch({}, invoke);
