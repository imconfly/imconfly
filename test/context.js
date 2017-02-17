"use strict";

const assert = require("assert");
const context = require("../app/context");
const conf = require("../app/conf");
const c = require("./common");

const testConf = new conf.Conf(c.CONF, __dirname);

describe(`When URI is "${c.URL_ORIGIN_REMOTE}"`, () => {
  const ctx = new context.Context(testConf, c.URL_ORIGIN_REMOTE);
  it(`ctx.container should be "${c.CONF_CONTAINER_REMOTE}"`, () => assert.strictEqual(ctx.container, c.CONF_CONTAINER_REMOTE));
  it('ctx.transform should be null', () => assert.strictEqual(ctx.transform, null));
  it('ctx.transformPath should be null', () => assert.strictEqual(ctx.transformPath, null));
  it('ctx.transformAction should be null', () => assert.strictEqual(ctx.transformAction, null));
  it(`ctx.relative should be ['${c.RELATIVE_REMOTE}']`, () => assert.deepEqual(ctx.relative, [c.RELATIVE_REMOTE]));
  it(`ctx.originLocalPath should be "${c.CALCULATED_ORIGIN_PATH_REMOTE}"`, () => assert.strictEqual(ctx.originLocalPath, c.CALCULATED_ORIGIN_PATH_REMOTE));
  it(`ctx.originRemoteURL should be "${c.CALCULATED_ORIGIN_URL_REMOTE}"`, () => assert.strictEqual(ctx.originRemoteURL, c.CALCULATED_ORIGIN_URL_REMOTE));
});

describe(`When URI is "${c.URL_TRANSFORM_REMOTE}"`, () => {
  const ctx = new context.Context(testConf, c.URL_TRANSFORM_REMOTE);
  it(`ctx.transform should be "${c.CONF_TRANSFORM_NAME}"`, () => assert.strictEqual(ctx.transform, c.CONF_TRANSFORM_NAME));
  it(`ctx.transformPath should be "${c.CALCULATED_TRANSFORM_PATH_REMOTE}"`, () => assert.strictEqual(ctx.transformPath, c.CALCULATED_TRANSFORM_PATH_REMOTE));
  it(`ctx.transformAction should be "${c.CONF_TRANSFORM_ACTION}"`, () => assert.strictEqual(ctx.transformAction, c.CONF_TRANSFORM_ACTION));
});

describe(`When URI is "${c.URL_TRANSFORM_LOCAL}"`, () => {
  const ctx = new context.Context(testConf, c.URL_TRANSFORM_LOCAL);
  it(`ctx.transformPath should be "${c.CALCULATED_TRANSFORM_PATH_LOCAL}"`, () => assert.strictEqual(ctx.transformPath, c.CALCULATED_TRANSFORM_PATH_LOCAL));
  it(`ctx.relative should be [${c.RELATIVE_LOCAL}]`, () => assert.deepEqual(ctx.relative, c.RELATIVE_LOCAL));
  it(`ctx.originLocalPath should be "${c.CALCULATED_ORIGIN_PATH_LOCAL}"`, () => assert.strictEqual(ctx.originLocalPath, c.CALCULATED_ORIGIN_PATH_LOCAL));
  it(`ctx.originRemoteURL should be null`, () => assert.strictEqual(ctx.originRemoteURL, null));
});


describe('ContextBadTransformError throws when URI is', () => {
  it('/WAT/origin/nodejs-1024x768.png (bad container)', () => assert.throws(
    () => new context.Context(testConf, '/WAT/origin/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
  it('/nodejs/WAT/nodejs-1024x768.png (bad transform)', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/WAT/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
});


describe('ContextFormatError throws when URI is', () => {
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
