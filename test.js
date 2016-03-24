'use strict';

const CONTAINER = 'nodejs';
const ORIGIN = 'origin';
const TRANSFORM = 'square_200x200';
const PATH = 'nodejs-1024x768.png';

require('co-mocha');
var conf = require('./conf/test');
var app = require('./imconfly')(conf);
var supertest = require('co-supertest');
var rimraf = require('rimraf-promise');

var request = supertest.agent(app.listen(conf.port));

function url(transform, path) {
  if (!transform) {
    transform = TRANSFORM;
  }
  if (!path) {
    path = PATH;
  }
  return `/${CONTAINER}/${transform}/${path}`;
}

describe('Common tests', function() {
  this.timeout(15000);

  before(function *() {
    yield rimraf(conf.storage_root);
  });

  after(function *() {
    yield rimraf(conf.storage_root);
  });

  it('homepage', function* () {
    yield request
      .get('/')
      .expect(404);
  });

  it('get origin', function* () {
    yield request
      .get(url(ORIGIN))
      .expect(200);
  });

  it(`make transform ${TRANSFORM}`, function* () {
    yield request
      .get(url())
      .expect(200);
  });

  it('serve origin', function* () {
    yield request
      .get(url(ORIGIN))
      .expect(200);
  });

  it(`serve transform ${TRANSFORM}`, function* () {
    yield request
      .get(url())
      .expect(200);
  })
});
