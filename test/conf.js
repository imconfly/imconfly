"use strict";

const assert = require("assert");
const path = require("path");
const conf = require("../app/conf");
const common = require("./common");

const VALID_WD = __dirname;
const VALID_CONF = {
  containers: {
    test: {
      root: "https://nodejs.org/static/images/logos"
    }
  }
};


describe("ConfError throws when", () => {
  it("given conf in not an object", () => assert.throws(
    () => new conf.Conf(0, VALID_WD),
    conf.ConfError
  ));
  it('workdir is not a directory', () => assert.throws(
    () => new conf.Conf(VALID_CONF, "zzz"),
    conf.ConfError
  ));
  it(`"storageRoot" param is not a string`, () => assert.throws(
    () => new conf.Conf(Object.assign({storageRoot: 0}, VALID_CONF), VALID_WD),
    conf.ConfError
  ));
  it(`"storageRoot" param is an empty string`, () => assert.throws(
    () => new conf.Conf(Object.assign({storageRoot: ""}, VALID_CONF), VALID_WD),
    conf.ConfError
  ));
  it(`"port" param is not a number`, () => assert.throws(
    () => new conf.Conf(Object.assign({port: "8888"}, VALID_CONF), VALID_WD),
    conf.ConfError
  ));
  it(`"containers" param missed`, () => assert.throws(
    () => new conf.Conf({}, VALID_WD),
    conf.ConfError
  ));
  it(`"containers" param is not an object`, () => {
    let c = Object.assign({}, VALID_CONF);
    c.containers = 0;
    assert.throws(
      () => new conf.Conf(c, VALID_WD),
      conf.ConfError
    )
  });
  it(`"containers" param is an empty object`, () => {
    let c = Object.assign({}, VALID_CONF);
    c.containers = {};
    assert.throws(
      () => new conf.Conf(c, VALID_WD),
      conf.ConfError
    )
  });
  it(`param "root" not found in container`, () => {
    let c = Object.assign({}, VALID_CONF);
    c.containers = {test: {}};
    assert.throws(
      () => new conf.Conf(c, VALID_WD),
      conf.ConfError
    )
  });
  it(`param "root" in container is not a string`, () => {
    let c = Object.assign({}, VALID_CONF);
    c.containers = {test: {root: 0}};
    assert.throws(
      () => new conf.Conf(c, VALID_WD),
      conf.ConfError
    )
  });
});

describe(`When parse ${common.TEST_CONF_FILE}`, () => {
  let testConf = conf.Conf.fromFile(common.TEST_CONF_FILE);
  // console.dir(testConf, {depth: 10});
});
