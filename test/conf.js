"use strict";

const assert = require("assert");
const path = require("path");
const conf = require("../app/conf");

const WD = __dirname;
const TEST_CONF_FILE = path.resolve(__dirname, "data", "conf.js");
console.log(TEST_CONF_FILE);

describe("ConfError throws when", () => {
  it("given conf in not an object", () => assert.throws(
    () => new conf.Conf(0, WD),
    conf.ConfError
  ));
  it('workdir is not a directory', () => assert.throws(
    () => new conf.Conf({}, "zzz"),
    conf.ConfError
  ));
  it(`"storageRoot" param is not a string`, () => assert.throws(
    () => new conf.Conf({storageRoot: 0}, WD),
    conf.ConfError
  ));
  it(`"storageRoot" param is an empty string`, () => assert.throws(
    () => new conf.Conf({storageRoot: ""}, WD),
    conf.ConfError
  ));
});

describe(`When parse ${TEST_CONF_FILE}`, () => {
  let testConf = conf.Conf.fromFile(TEST_CONF_FILE);
  //console.log(testConf);
});
