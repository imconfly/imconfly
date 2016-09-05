imconfly
========

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Chat on Gitter][gitter-img]][gitter-url]

Web server for full-custom images conversion on-the-fly. Fast cache, low resources consumption.

Written in JavaScript, powered by [Node.js][nodejs-url] and available as [NPM][npm-home-url] package.

Imconfly uses CLI applications like [Imagemagick][imagemagick-url] with full-custom set of
parameters for images conversion. This is extremely flexible approach, you can create any transformation you
need, using any CLI tool or bunch of CLI tools.

On the other hand, Imconfly is designed for fast serving once transformed images with low resources consumption. These 
images can be served by [Nginx][nginx-url] or any fast-and-light static web server.

Quick example
-------------

You have an image, <https://nodejs.org/static/images/logos/nodejs-1280x1024.png> for example. You want to transfom 
it to 100x100 pixels on red canvas and use on your site permanently.

After configuring Imconfly server, your transformed image will be immediately available by URL like this:

```
http://yoursite.com:9988/nodejs/100x100-red/logos/nodejs-1280x1024.png
```

Corresponding configuration:
 
```json
{
  "storageRoot": "/var/www/imconfly",
  "port": 9988,
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

Original image will be stored in

```
/var/www/imconfly/nodejs/origin/logos/nodejs-1280x1024.png
```

Transformed image can be found in 

```
/var/www/imconfly/nodejs/100x100-red/logos/nodejs-1280x1024.png
```

This is result of:

 * `/var/www/imconfly` (storageRoot setting) + 
 * `nodejs` (container name) + 
 * `100x100-red` (transformation name) + 
 * `logos/nodejs-1280x1024.png` (relative path) 

Command that be called to create the small copy (`100x100-red` transfomation):

```
convert "/var/www/imconfly/nodejs/origin/logos/nodejs-1280x1024.png" -resize 100x100 -background red -gravity center -extent 100x100 "/var/www/imconfly/nodejs/100x100-red/logos/nodejs-1280x1024.png"
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

``imconfly`` command needs to configuration file in the current directory or in a some parent directory - ``imconfile.js`` or ``imconfile.json``. 

For example:

```javascript
// imconfly.js

module.exports = {
  storageRoot: './STORAGE',
  port: 9988,
  containers: {
    nodejs: {
      root: 'https://nodejs.org/static/images/logos',
      transforms: {
        square_200x200: 'convert "{source}" -resize 200x200 -background red -gravity center -extent 200x200 "{destination}"'
      }
    }
  }
};
```

imconfly.json:


```json
{
  "storageRoot": "./STORAGE",
  "port": 9988,
  "containers": {
    "nodejs": {
      "root": "https://nodejs.org/static/images/logos",
      "transforms": {
        "square_200x200": "convert \"{source}\" -resize 200x200 -background red -gravity center -extent 200x200 \"{destination}\""
      }
    }
  }
}
```

You can copy this to correspond file, run ``imconfly`` and check it by this URL:

```
http://127.0.0.1:9988/nodejs/square_200x200/nodejs-1280x1024.png
```

### Global options

* ```storageRoot``` - path to directory with transformed images and origins
* ```port``` - port to listen by Imconfly application (HTTP protocol)
* ```urlChecker``` - regexp to check URL format on each request to Imconfly app (```/^[\w\./_-]+$/``` by default)
* ```containers``` - dictonary of containers names. Names must correspond to ```urlChecker``` format.

### Container options

* ```root``` - http(s) URL with server name and path (```http://example.com/my/path```) or local filesystem path 
  (```/my/path```).
* ```transforms``` - dictonary of transforms in ```name: command``` format. Command must contains special placeholders - 
  ```{source}``` and ```{destination}```. 
  
API
---

You can use Imconfly inside your apps. For example:

```javascript
var conf = require('./imconfile');
var app = require('imconfly')(conf);

app.listen();
```

Development
-----------

For tests you need to install [Imagemagick][imagemagick-url]. On Debian/Ubuntu:

```
# apt-get install imagemagick
```

On OS X (with [Homebrew][homebrew-url]):

```
$ brew install imagemagick
```

Run tests:

```
$ cd imconflySourcesDir
$ npm test
```


TODO
----

* [Version 1.0.0](https://github.com/imconfly/imconfly/milestone/1)
* [Version 1.1.0](https://github.com/imconfly/imconfly/milestone/2)

[Changelog](https://github.com/imconfly/imconfly/blob/master/CHANGELOG.md)
--------------------------------------------------------------------------

License
-------

MIT

[npm-image]: https://img.shields.io/npm/v/imconfly.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/imconfly
[travis-image]: https://img.shields.io/travis/imconfly/imconfly/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/imconfly/imconfly
[coveralls-image]: https://img.shields.io/codecov/c/github/imconfly/imconfly.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/imconfly/imconfly?branch=master
[imagemagick-url]: http://www.imagemagick.org
[nginx-url]: http://nginx.org
[homebrew-url]: http://brew.sh
[nodejs-url]: https://nodejs.org/en/
[npm-home-url]: https://www.npmjs.com
[gitter-img]: https://badges.gitter.im/imconfly/imconfly.svg
[gitter-url]: https://gitter.im/imconfly/imconfly?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
