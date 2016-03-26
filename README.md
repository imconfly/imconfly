Imconfly
========

Web server for full-custom images conversion on-the-fly. Fast cache, low resources consumption.

Imconfly uses CLI applications like [Imagemagick](http://www.imagemagick.org/) with full-custom set of
parameters for images conversion. This is extremely flexible approach, you can create any transformation you
need, using any CLI tool or bunch of CLI tools.

On the other hand, Imconfly is designed for fast serving once transformed images with low resources consumption. These 
images can be served by [Nginx](http://nginx.org/) or any fast-and-light static web server.

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
  "storage_root": "/var/www/imconfly",
  "port": 9988,
  "containers": {
    "nodejs": {
      "root": 'https://nodejs.org/static/images',
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

 * `/var/www/imconfly` (storage_root setting) + 
 * `nodejs` (container name) + 
 * `100x100-red` (transformation name) + 
 * `logos/nodejs-1280x1024.png` (relative path) 

Command that be called to create the small copy (`100x100-red` transfomation):

```
convert "/var/www/imconfly/nodejs/origin/logos/nodejs-1280x1024.png" -resize 100x100 -background red -gravity center -extent 100x100 "/var/www/imconfly/nodejs/100x100-red/logos/nodejs-1280x1024.png"
```

This is an expencive operation, and it performs once, on first-time request. 
After this, the image will be served as a static file.
