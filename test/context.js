"use strict";

const assert = require("assert");
const context = require("../app/context");
const conf = require("../app/conf");
const c = require("./common");

const testConf = new conf.Conf(c.CONF, __dirname);

describe(`Parsing "${c.URL_ORIGIN_REMOTE}"`, () => {
  const ctx = new context.Context(testConf, c.URL_ORIGIN_REMOTE);
  it(`ctx.container should be "${c.CONF_CONTAINER_REMOTE}"`, () => assert.strictEqual(ctx.container, c.CONF_CONTAINER_REMOTE));
  it('ctx.transform should be null', () => assert.strictEqual(ctx.transform, null));
  it('ctx.transformPath should be null', () => assert.strictEqual(ctx.transformPath, null));
  it('ctx.transformAction should be null', () => assert.strictEqual(ctx.transformAction, null));
  it(`ctx.relative should be ['${c.RELATIVE_REMOTE}']`, () => assert.deepEqual(ctx.relative, [c.RELATIVE_REMOTE]));
  it('ctx.originIsLocal should be false', () => assert.strictEqual(ctx.originIsLocal, false));
  it(`ctx.originLocalPath should be "${c.CALCULATED_ORIGIN_PATH_REMOTE}"`, () => assert.strictEqual(ctx.originLocalPath, c.CALCULATED_ORIGIN_PATH_REMOTE));
  it(`ctx.originRemoteURL should be "${c.CALCULATED_ORIGIN_URL_REMOTE}"`, () => assert.strictEqual(ctx.originRemoteURL, c.CALCULATED_ORIGIN_URL_REMOTE));
});

describe(`Parsing "${c.URL_TRANSFORM_REMOTE}"`, () => {
  const ctx = new context.Context(testConf, c.URL_TRANSFORM_REMOTE);
  it(`ctx.container should be "${c.CONF_CONTAINER_REMOTE}"`, () => assert.strictEqual(ctx.container, c.CONF_CONTAINER_REMOTE));
  it(`ctx.transform should be "${c.CONF_TRANSFORM_NAME}"`, () => assert.strictEqual(ctx.transform, c.CONF_TRANSFORM_NAME));
  // it('ctx.transformPath should be null', () => assert.strictEqual(ctx.transformPath, null));
  // it('ctx.transformAction should be null', () => assert.strictEqual(ctx.transformAction, null));
  // it(`ctx.relative should be ['${c.RELATIVE_REMOTE}']`, () => assert.deepEqual(ctx.relative, [c.RELATIVE_REMOTE]));
  // it('ctx.originIsLocal should be false', () => assert.strictEqual(ctx.originIsLocal, false));
  // it(`ctx.originLocalPath should be "${c.CALCULATED_ORIGIN_PATH_REMOTE}"`, () => assert.strictEqual(ctx.originLocalPath, c.CALCULATED_ORIGIN_PATH_REMOTE));
  // it(`ctx.originRemoteURL should be "${c.CALCULATED_ORIGIN_URL_REMOTE}"`, () => assert.strictEqual(ctx.originRemoteURL, c.CALCULATED_ORIGIN_URL_REMOTE));
});


describe('ContextBadTransformError throws when', () => {
  it('/WAT/origin/nodejs-1024x768.png (bad container)', () => assert.throws(
    () => new context.Context(testConf, '/WAT/origin/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
  it('/nodejs/WAT/nodejs-1024x768.png (bad transform)', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/WAT/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
});


describe('ContextFormatError throws when', () => {
  it("/", () => assert.throws(
    () => new context.Context(testConf, "/"),
    context.ContextFormatError
  ));
  it("/nodejs", () => assert.throws(
    () => new context.Context(testConf, "/nodejs"),
    context.ContextFormatError
  ));
  it("/nodejs/", () => assert.throws(
    () => new context.Context(testConf, "/nodejs/"),
    context.ContextFormatError
  ));
  it('/nodejs/origin', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/../nodejs-1024x768.png', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/../nodejs-1024x768.png'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/./nodejs-1024x768.png', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/./nodejs-1024x768.png'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/"', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/"'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/&', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/&'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/..', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/..'),
    context.ContextFormatError
  ));
  it('/nodejs/origin//', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin//'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/такнельзя', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/такнельзя'),
    context.ContextFormatError
  ));
});
