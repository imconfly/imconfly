"use strict";

const rimraf = require("rimraf");
const supertest = require('supertest');
const conf = require("../app/conf");
const Imconfly = require("../app");
const common = require("./common");

const URL_TRANSFORM = "/nodejs/square_200x200/nodejs-1024x768.png";
const URL_ORIGIN = "/nodejs/origin/nodejs-1024x768.png";
const TEST_TIMEOUT = 15000;

const testConf = conf.Conf.fromFile(common.TEST_CONF_FILE);

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
});
