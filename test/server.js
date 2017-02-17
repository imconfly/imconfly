"use strict";

const rimraf = require("rimraf");
const supertest = require('supertest');
const conf = require("../app/conf");
const Imconfly = require("../app");
const common = require("./common");

const URL_TRANSFORM = "/nodejs/dummy/nodejs-1024x768.png";
const URL_ORIGIN = "/nodejs/origin/nodejs-1024x768.png";
const TEST_TIMEOUT = 15000;

const testConf = new conf.Conf(common.CONF, __dirname);
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

  it(`when get ${URL_ORIGIN} (get origin) status should be 200`, done => {
    request
      .get(URL_ORIGIN)
      .expect(200, done);
  });

  // it(`when get ${URL_TRANSFORM} (make transform) status should be 200`, done => {
  //   request
  //     .get(URL_TRANSFORM)
  //     .expect(200, done);
  // });

  // it(`when get ${URL_ORIGIN} (serve origin) status should be 200`, done => {
  //   request
  //     .get(URL_ORIGIN)
  //     .expect(200, done);
  // });
  //
  // it(`when get ${URL_TRANSFORM} (serve transform) status should be 200`, done => {
  //   request
  //     .get(URL_TRANSFORM)
  //     .expect(200, done);
  // });
});
