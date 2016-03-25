'use strict';

const CONTAINER = 'nodejs';
const ORIGIN = 'origin';
const TRANSFORM = 'square_200x200';
const PATH = 'nodejs-1024x768.png';

require('co-mocha');
const assert = require('assert');
const path = require('path');

const conf = require('../conf/test');
const app = require('../imconfly')(conf);

function url(path, transform, container) {
  if (!container) {
    container = CONTAINER;
  }
  if (!transform) {
    transform = TRANSFORM;
  }
  if (!path) {
    path = PATH;
  }
  return `/${container}/${transform}/${path}`;
}

describe('Components tests', function() {
  it('urlParser with valid params', () => {
    var r = app.urlParser(url());
    assert.equal(r.container, CONTAINER);
  });

  it('urlParser - invalid container', () => {
    assert.throws(() => {app.urlParser(url(PATH, TRANSFORM, 'invalid'))});
  });

  it('urlParser - invalid transform', () => {
    assert.throws(() => {app.urlParser(url(PATH, 'invalid'))});
  });

  //it('urlParser - invalid path', () => {
  //  //assert.throws(() => {app.urlParser(url('&'))});
  //  //assert.throws(() => {app.urlParser(url('..'))});
  //  //assert.throws(() => {app.urlParser(url(''))});
  //  //assert.throws(() => {app.urlParser(url('/'))});
  //  var bad = [
  //    '../../../../../../something',
  //    ' &^ a` ad ....'
  //  ];
  //  for (let i = 0; i < bad.length; i++) {
  //    let r = app.urlParser(url(bad[i]));
  //    console.log(bad[i], r.relativePath, path.parse(r.relativePath), '\n\n');
  //  }
  //});
});
