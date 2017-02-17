"use strict";

const rimraf = require("rimraf");
const supertest = require('supertest');
const conf = require("../app/conf");
const Imconfly = require("../app");
const c = require("./common");

const TEST_TIMEOUT = 15000;

const testConf = new conf.Conf(c.CONF, __dirname);
const app = new Imconfly(testConf);
const request = supertest.agent(app.listen());

describe('Server tests.', function() {
  this.timeout(TEST_TIMEOUT);
  before(done => rimraf(testConf.storageRoot, done));
  after(done => rimraf(testConf.storageRoot, done));

  it('when get / status should be 404', done => {
    request
      .get('/')
      .expect(404, done);
  });

  it(`when get ${c.URL_ORIGIN_REMOTE} (get origin) status should be 200`, done => {
    request
      .get(c.URL_ORIGIN_REMOTE)
      .expect(200, done);
  });

  it(`when get ${c.URL_TRANSFORM_REMOTE} (make transform) status should be 200`, done => {
    request
      .get(c.URL_TRANSFORM_REMOTE)
      .expect(200, done);
  });

  it(`when get ${c.URL_ORIGIN_REMOTE} (serve origin) status should be 200`, done => {
    request
      .get(c.URL_ORIGIN_REMOTE)
      .expect(200, done);
  });

  it(`when get ${c.URL_TRANSFORM_REMOTE} (serve transform) status should be 200`, done => {
    request
      .get(c.URL_TRANSFORM_REMOTE)
      .expect(200, done);
  });
});
