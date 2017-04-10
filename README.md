imconfly
========

[![Join the chat at https://gitter.im/imconfly/Lobby](https://badges.gitter.im/imconfly/Lobby.svg)](https://gitter.im/imconfly/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![App Veyor][appveyor-image]][appveyor-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Chat on Gitter][gitter-img]][gitter-url]

Web server for full-custom images conversion on-the-fly. Fast cache, low resources consumption.

Imconfly uses CLI applications like [Imagemagick][imagemagick-url] with full-custom set of
parameters for images conversion. This is extremely flexible approach, you can create any transformation you
need, using any CLI tool or bunch of CLI tools.

On the other hand, Imconfly is designed for fast serving once transformed images with low resources consumption. These 
images can be served by [Nginx][nginx-url] or any fast-and-light static web server.

Quick example
-------------

You have an image, <https://nodejs.org/static/images/logos/nodejs-1280x1024.png> for example. You want to transfom 
it to 100x100 pixels on red canvas and use on your site permanently.

After configuring and run Imconfly server, your transformed image will be immediately available by URL like this:

<http://localhost:9989/nodejs/100x100-red/logos/nodejs-1280x1024.png>

Corresponding configuration:
 
```json
{
  "containers": {
    "nodejs": {
      "root": "https://nodejs.org/static/images",
      "transforms": {
        "100x100-red": "convert \"{source}\" -resize 100x100 -background red -gravity center -extent 100x100 \"{destination}\""
      }
    }
  }
}
```

* *this example uses ``convert`` command from [Imagemagick][imagemagick-url] toolkit*
* *``root`` settings can be local directory path like ``/var/www/my_imgs``*

For example, configuration file is ``/home/mike/imcf-example/imconfile.json``, in this case:

* Original image will be stored in ``/home/mike/imcf-example/imconfly_storage/nodejs/origin/logos/nodejs-1280x1024.png``
* Transformed image will be stored in ``/home/mike/imcf-example/imconfly_storage/nodejs/100x100-red/logos/nodejs-1280x1024.png``

This is result of:

 * `/home/mike/imcf-example/imconfly_storage` - *storageRoot* setting by default - path to *imconfile* + "imconfly_storage" + 
 * `nodejs` - *container* name + 
 * `100x100-red` - *transformation* name + 
 * `logos/nodejs-1280x1024.png` - *relative path* 

Command that be called to create the small copy (`100x100-red` transfomation):

```
convert "/home/mike/imcf-example/imconfly_storage/nodejs/origin/logos/nodejs-1280x1024.png" -resize 100x100 -background red -gravity center -extent 100x100 "/home/mike/imcf-example/imconfly_storage/nodejs/100x100-red/logos/nodejs-1280x1024.png"
```

This is an expencive operation, and it performs once, on first-time request. 
After this, the image will be served as a static file.

Installation
------------

Installation with [NPM][npm-home-url] as global module:

```
$ npm i -g imconfly
```

Run:

```
$ imconfly
```

Configuration
-------------

### imconfile

``imconfly`` command needs to configuration file in the current directory or in a some parent directory - 
``imconfile.js`` or ``imconfile.json``. 

For example:

```javascript
// imconfile.js

module.exports = {
  containers: {
    nodejs: {
      root: "https://nodejs.org/static/images",
      transforms: {
        "100x100-red": "convert \"{source}\" -resize 100x100 -background red -gravity center -extent 100x100 \"{destination}\""
      }
    }
  }
};
```

``imconfile.json``:


```json
{
  "containers": {
    "nodejs": {
      "root": "https://nodejs.org/static/images",
      "transforms": {
        "100x100-red": "convert \"{source}\" -resize 100x100 -background red -gravity center -extent 100x100 \"{destination}\""
      }
    }
  }
}
```

You can copy this to correspond file, run ``imconfly`` and check it by this URL:

<http://localhost:9989/nodejs/100x100-red/logos/nodejs-1280x1024.png>

### Relative paths

Relative paths in configuration will be resolved from directory of *imconfile*.
    
If your *imconfile* is ``/home/mike/imcf-example/imconfile.json``, "./imcf_storage" will be resolved as
``/home/mike/imcf-example/imcf_storage``

### Global options

* ``storageRoot`` - path to directory with transformed images and origins. Defalut is ``./imconfly_storage``.
* ``port`` - port to listen by Imconfly application (HTTP protocol). ``9989`` by default.
* ``urlChecker`` - regexp to check URL format on each request to Imconfly app (``/^[\w\./_-]+$/`` by default)
* ``maxage`` - amount of seconds for ``Cache-Control: max-age=`` http header. Default is ``2678400`` (31 day).
* ``containers`` - dictonary of containers names. Names must correspond to ``urlChecker`` format.

### Container options

* ```root``` - http(s) URL with server name and path (```http://example.com/my/path```) or local filesystem path 
  (```/my/path```).
* ```transforms``` - dictonary of transforms in ```name: command``` format. Command must contains special placeholders - 
  ```{source}``` and ```{destination}```. 
  
API
---

You can use Imconfly inside your apps. For example:

```javascript
const imconfly = require('imconfly');
const imcfConf = imconfly.conf.Conf.fromFile('imconfile.json');
// or
// const imcfRawConf = require('./imconfile'); 
// const imcfConf = new imconly.conf.Conf(imcfRawConf, __dirname); 
const app = new imconlfy.Imconfly(imcfConf);

app.listen();
```

Development
-----------

Run tests:

```
$ npm test
```

Run only specified test suite (``server`` for example):

```
$ npm test test/server
```

TODO
----

* [Version 1.0.0](https://github.com/imconfly/imconfly/milestone/1)

--------------------------------------------------------------------------

Links
-----

* [Chat on Gitter][gitter-url]
* [Chat on Gitter (Russian language)][gitter-url-ru] 

License
-------

MIT


[npm-image]: https://img.shields.io/npm/v/imconfly.svg
[npm-url]: https://www.npmjs.com/package/imconfly
[travis-image]: https://img.shields.io/travis/imconfly/imconfly/master.svg
[travis-url]: https://travis-ci.org/imconfly/imconfly
[coveralls-image]: https://img.shields.io/codecov/c/github/imconfly/imconfly.svg
[coveralls-url]: https://codecov.io/github/imconfly/imconfly?branch=master
[imagemagick-url]: http://www.imagemagick.org
[nginx-url]: http://nginx.org
[npm-home-url]: https://www.npmjs.com
[gitter-img]: https://badges.gitter.im/imconfly/imconfly.svg
[gitter-url]: https://gitter.im/imconfly/imconfly
[gitter-url-ru]: https://gitter.im/imconfly/imconfly-ru
[appveyor-image]: https://img.shields.io/appveyor/ci/i-erokhin/imconfly/master.svg?label=windows%20build
[appveyor-url]: https://ci.appveyor.com/project/i-erokhin/imconfly/branch/master
