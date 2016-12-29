(function(root) {
  var Color = function() {};
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
  var img = null;

  /**
   * Internal functions
   */

  function _createImage(url) {
    img = new Image();

    img.crossOrigin = 'Anonymous';
    img.src = url;

    if (img.complete) {
      _createCanvas();
    } else {
      img.addEventListener('load', function() {
        _createCanvas();
      });
    }
  }

  function _createCanvas() {
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

    _extract(info.data);
    document.body.removeChild(canvas);

    // Collect garbage
    canvas = null;
  }

  function _extract(data) {
    for (var i = 0; i < (img.width * img.height); i += 4) {
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

    _average();
  }

  function _average() {
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
