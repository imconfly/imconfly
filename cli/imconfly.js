#!/usr/bin/env node
'use strict';

const imconfile = path.resolve(process.cwd(), 'imconfile');
console.log(`Try to use configuration module: ${imconfile}`);
const conf = require(imconfile);
const app = require('../app/imconfly')(conf);
app.listen();
console.log(`Try to use ${app.conf.storageRoot} as storageRoot`);
console.log(`listening on port ${app.conf.port}`);