"use strict";

const path = require("path");
const assert = require("assert");
const context = require("../app/context");
const testConf = require("./data/conf");

// console.dir(testConf, {depth: 5});

describe('Parsing "/nodejs/origin/nodejs-1024x768.png"', () => {
  const correctOriginLocalPath = path.resolve(
  	testConf.storageRoot,
  	'nodejs',
  	'origin',
  	'nodejs-1024x768.png'
  );
  const correctOriginRemoteURL =
  	testConf.containers.nodejs.root +
  	'/nodejs-1024x768.png';

  const ctx = new context.Context(testConf, '/nodejs/origin/nodejs-1024x768.png');

  it('ctx.container should be "nodejs"',
  	() => assert.strictEqual(ctx.container, 'nodejs'));
  it('ctx.transform should be null',
  	() => assert.strictEqual(ctx.transform, null));
  it('ctx.transformPath should be null',
  	() => assert.strictEqual(ctx.transformPath, null));
  it('ctx.transformAction should be null',
    () => assert.strictEqual(ctx.transformAction, null));
  it(`ctx.relative should be ['nodejs-1024x768.png']`,
    () => assert.deepEqual(ctx.relative, ['nodejs-1024x768.png']));
  it('ctx.originIsLocal should be false',
  	() => assert.strictEqual(ctx.originIsLocal, false));
  it(`ctx.originLocalPath should be "${correctOriginLocalPath}"`,
  	() => assert.strictEqual(ctx.originLocalPath, correctOriginLocalPath));
  it(`ctx.originRemoteURL should be "${correctOriginRemoteURL}"`,
  	() => assert.strictEqual(ctx.originRemoteURL, correctOriginRemoteURL));
});

describe('ContextBadTransformError throw', () => {
  it('/WAT/origin/nodejs-1024x768.png', () => assert.throws(
    () => new context.Context(testConf, '/WAT/origin/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
  it('/nodejs/WAT/nodejs-1024x768.png', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/WAT/nodejs-1024x768.png'),
    context.ContextBadTransformError
  ));
});

describe('ContextFormatError throw', () => {
  it('/nodejs/origin/&', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/&'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/..', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/..'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/'),
    context.ContextFormatError
  ));
  it('/nodejs/origin', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin'),
    context.ContextFormatError
  ));
  it('/nodejs/origin//', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin//'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/"', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/"'),
    context.ContextFormatError
  ));
  it('/nodejs/origin/такнельзя', () => assert.throws(
    () => new context.Context(testConf, '/nodejs/origin/такнельзя'),
    context.ContextFormatError
  ));
});
