(function(root) {
  var Color = function() {};

  /**
   * Internal functions
   */

  function _createImage(url) {
    var img = new Image();

    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.addEventListener('load', function() {
      _createCanvas(img);
    });
  }

  function _createCanvas(img) {
    var canvas = document.createElement('canvas');

    if (typeof canvas.getContext === 'undefined') {
      return false;
    }

    var context = canvas.getContext('2d');

    canvas.height = img.height;
    canvas.style.display = 'none';
    canvas.width = img.width;
    context.drawImage(img, 0, 0);

    document.body.appendChild(canvas);

    var info = context.getImageData(0, 0, img.width, img.height);

    _extract(info.data, (img.width * img.height));
    document.body.removeChild(canvas);

    // Collect garbage
    canvas = null;
    img = null;
  }

  function _extract(data, size) {
    var channels = {
      r: {
        amount: 0,
        total: 0,
      },
      g: {
        amount: 0,
        total: 0,
      },
      b: {
        amount: 0,
        total: 0,
      },
    };

    for (var i = 0; i < size; i += 4) {
      if (data[i + 3] < (255 / 2)) {
        continue;
      }

      var iterator = i;

      for (var key in channels) {
        channels[key].amount++;
        channels[key].total += data[iterator];

        iterator++;
      }
    }

    _average(channels);
  }

  function _average(channels) {
    var colors = [];

    for (var key in channels) {
      colors.push(_format(channels[key].total / channels[key].amount));
    }

    var render = 'rgb(' + colors.join(', ') + ')';
  }

  function _format(value) {
    return Math.round(value);
  }

  /**
   * External API
   */

  Color.prototype.fromUrl = function(url) {
    _createImage(url);
  };

  Color.prototype.fromImage = function(image) {
    _createImage(image.src);
  }

  /**
   * Module
   */

  if (typeof module === 'object') {
    module.exports = Color;
  } else {
    root.Color = Color;
  }
})(this);
