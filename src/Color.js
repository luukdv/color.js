(function(root) {
  var _callback = null;
  var _data = null;
  var _img = null;
  var _method = null;
  var _url = null;

  /**
   * Internal functions
   */

  function _createImage() {
    var img = document.createElement('img');

    img.crossOrigin = 'Anonymous';
    img.src = _url;

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
    _data = info.data;

    document.body.removeChild(canvas);

    _method();
  }

  function _extract() {
    var channels = {
      r: {amount: 0, total: 0},
      g: {amount: 0, total: 0},
      b: {amount: 0, total: 0},
    };

    for (var i = 0; i < (_img.width * _img.height); i += 4) {
      if (_data[i + 3] < (255 / 2)) {
        continue;
      }

      var iterator = i;

      for (var key in channels) {
        channels[key].amount++;
        channels[key].total += _data[iterator];

        iterator++;
      }
    }

    return channels;
  }

  function _average() {
    var colors = [];
    var channels = _extract();

    console.log(channels);

    for (var key in channels) {
      colors.push(_format(channels[key].total / channels[key].amount));
    }

    _callback('rgb(' + colors.join(', ') + ')');
  };

  function _format(value) {
    return Math.round(value);
  }

  /**
   * External API
   */

  var Color = function(item) {
    if (typeof item === 'object' && item.src) {
      _url = item.src;
    } else if (typeof item === 'string') {
      _url = item;
    }
  };

  Color.prototype.average = function(callback) {
    _method = _average;
    _callback = callback;

    _createImage();
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
