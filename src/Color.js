(function(root) {
  var _channels = {
    r: {amount: 0, total: 0},
    g: {amount: 0, total: 0},
    b: {amount: 0, total: 0},
  };
  var _img = null;

  /**
   * Internal functions
   */

  function _createImage(url) {
    var img = document.createElement('img');

    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.addEventListener('load', function() {
      _img = img;
      _createCanvas();
    });
  }

  function _createCanvas() {
    var canvas = document.createElement('canvas');

    if (typeof canvas.getContext === 'undefined') {
      return false;
    }

    var context = canvas.getContext('2d');

    canvas.height = _img.height;
    canvas.style.display = 'none';
    canvas.width = _img.width;
    context.drawImage(_img, 0, 0);

    document.body.appendChild(canvas);

    var info = context.getImageData(0, 0, _img.width, _img.height);

    _extract(info.data);
    document.body.removeChild(canvas);
  }

  function _extract(data) {
    for (var i = 0; i < (_img.width * _img.height); i += 4) {
      if (data[i + 3] < (255 / 2)) {
        continue;
      }

      var iterator = i;

      for (var key in _channels) {
        _channels[key].amount++;
        _channels[key].total += data[iterator];

        iterator++;
      }
    }

    _average();
  }

  function _average() {
    var colors = [];

    for (var key in _channels) {
      colors.push(_format(_channels[key].total / _channels[key].amount));
    }

    var render = 'rgb(' + colors.join(', ') + ')';
  }

  function _format(value) {
    return Math.round(value);
  }

  /**
   * External API
   */

  var Color = function(item) {
    if (typeof item === 'object' && item.src) {
      _createImage(item.src);
    } else if (typeof item === 'string') {
      _createImage(item);
    }
  };

  /**
   * Module
   */

  if (typeof module === 'object') {
    module.exports = Color;
  } else {
    root.Color = Color;
  }
})(this);
