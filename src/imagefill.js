/**
 * imagefill.js
 * Author & copyright (c) 2013: John Polacek
 * Updated to npm by @oresh
 * Updated to remove jquery dependancy by @tbredin
 * johnpolacek.com
 * https://twitter.com/johnpolacek
 *
 * The jQuery plugin for making images fill their containers (and be centered)
 *
 * EXAMPLE
 * Given this html:
 * <div class="container"><img src="myawesomeimage" /></div>
 * imagefill(document.querySelector('.container'), options); // image stretches to fill container
 *
 * REQUIRES:
 * imagesLoaded - https://github.com/desandro/imagesloaded
 *
 */

"use strict";

// extend function to handle settings
var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

function imagefill(container, options) {
  if (container) {
    var $container = container,
        imageAspect = 1/1,
        containersH = 0,
        containersW = 0,
        defaults = {
          runOnce: false,
          target: 'img',
          throttle : 32  // 30fps
        },
        settings = extend({}, defaults, options);

    var $img = $container.querySelector(settings.target);
    $img.className += ' loading';
    $img.style.position = 'absolute';

    // make sure container isn't position:static
    var containerPos = getComputedStyle($container)['position'];

    $container.style.overflow = 'hidden';
    $container.style.position = (containerPos === 'static') ? 'relative' : containerPos;

    // set containerH, containerW
    containersH += $container.offsetHeight;
    containersW += $container.offsetWidth;

    // wait for image to load, then fit it inside the container
    imagesLoaded($container, function(img) {
      imageAspect = $img.width / $img.height;

      $img.className = $img.className.replace(/(\s|^)loading(\s|$)/, ' ');

      fitImages($container);
      if (!settings.runOnce) {
        checkSizeChange();
      }
    });
  }

  function fitImages() {
    containersH  = 0;
    containersW = 0;

    var $this = $container;
    imageAspect = $this.querySelectorAll(settings.target).width / $this.querySelectorAll(settings.target).height;

    var outerWidth = $this.offsetWidth,
        outerHeight = $this.offsetHeight,
        containerW = outerWidth,
        containerH = outerHeight,
        containerAspect = containerW / containerH,
        $target = $this.querySelector(settings.target);

    containersH += outerHeight;
    containersW += outerHeight;

    if (containerAspect < imageAspect) {
      // taller
      $target.style.width = 'auto';
      $target.style.height = containerH + 'px';
      $target.style.top = '0px';
      $target.style.left = -parseInt((containerH * imageAspect - containerW) / 2) + 'px';
    } else {
      // wider
      $target.style.width = containerW + 'px';
      $target.style.height = 'auto';
      $target.style.top = -parseInt((containerW / imageAspect - containerH) / 2) + 'px';
      $target.style.left = '0px';
    }
  }

  function checkSizeChange() {
    var checkW = 0,
        checkH = 0;
    for (var i = 0, len = $container.length; i < len; i++) {
      var $this = $container.eq(i);
      checkH += $this.offsetHeight;
      checkW += $this.offsetWidth;
    };
    if (containersH !== checkH || containersW !== checkW) {
      fitImages();
    }
    setTimeout(checkSizeChange, settings.throttle);
  }

  return this;
};

/**
 * Module that runs the imagefill plugin for cover images.
 * Currently used for case study hero image.
 */

imagefill(document.querySelector('.js-cover'), {
  // runOnce: true,
  target: '.js-background'
});
