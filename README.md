# Console Sketch Mirror Hack

Warning; very hacky.

Use any [bonjour/zeroconf browser](http://www.tildesoft.com/) to find the host and ip of your sketch instance, then add it to [test.js](test.js) and run it. Sketch should then show a banner that this mirror is available. after that, every update to the current artboard will be rendered in the terminal using the [image-to-ascii](https://www.npmjs.com/package/image-to-ascii) package, if you have problems installing the npm packages (i did) you should install GraphicsMagick first.
