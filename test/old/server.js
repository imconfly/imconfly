'use strict';

const CONTAINER = 'nodejs';
const ORIGIN = 'origin';
const TRANSFORM = 'square_200x200';
const PATH = 'nodejs-1024x768.png';

require('co-mocha');
const supertest = require('co-supertest');
const rimraf = require('rimraf-promise');

const conf = require('../conf/test');
const app = require('../app')(conf);

const request = supertest.agent(app.listen());

function url(transform, path) {
  if (!transform) {
    transform = TRANSFORM;
  }
  if (!path) {
    path = PATH;
  }
  return `/${CONTAINER}/${transform}/${path}`;
}

describe('Server tests', function() {
  this.timeout(15000);

  before(function *() {
    yield rimraf(conf.storageRoot);
  });

  after(function *() {
    yield rimraf(conf.storageRoot);
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
