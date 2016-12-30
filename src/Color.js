(function(root) {
  var Color = function(item) {
    this._data = null;
    this._img = null;
    this._callbacks = [];
    this._url = null;

    if (typeof item === 'object' && item.src) {
      this._url = item.src;
    } else if (typeof item === 'string') {
      this._url = item;
    }

    this._running = true;
    this._createImage();
  };

  /**
   * Helpers
   */

  function _format(number) {
    return Math.round(number);
  }

  function _roundTo20(number) {
    return Math.round(number / 20) * 20;
  }

  /**
   * Internals
   */

  Color.prototype._runCallbacks = function() {
    this._callbacks.forEach(function(method, key) {
      this._callbacks[key].method.call(this, this._callbacks[key].call);
      this._callbacks.splice(key, 1);
    }.bind(this));
  };

  Color.prototype._createImage = function() {
    this._img = document.createElement('img');
    this._img.crossOrigin = 'Anonymous';
    this._img.src = this._url;

    this._img.addEventListener('load', function() {
      this._createCanvas();
    }.bind(this));
  };

  Color.prototype._createCanvas = function() {
    var canvas = document.createElement('canvas');

    if (typeof canvas.getContext === 'undefined') {
      return false;
    }

    var context = canvas.getContext('2d');

    canvas.height = this._img.height;
    canvas.style.display = 'none';
    canvas.width = this._img.width;
    context.drawImage(this._img, 0, 0);

    document.body.appendChild(canvas);

    var info = context.getImageData(0, 0, this._img.width, this._img.height);
    this._data = info.data;
    this._running = false;

    document.body.removeChild(canvas);

    this._runCallbacks();
  };

  Color.prototype._average = function(callback) {
    var colors = [];
    var channels = this._extractChannels();

    for (var key in channels) {
      colors.push(_format(channels[key].total / channels[key].amount));
    }

    callback('rgb(' + colors.join(', ') + ')');
  };

  Color.prototype._mostUsed = function(callback) {
    var colors = this._extractColorBlocks();
    var highest = {
      count: 0,
    };

    for (var color in colors) {
      if (highest.count < colors[color]) {
        highest = {
          color: color,
          count: colors[color],
        };
      }
    }

    callback('rgb(' + highest.color + ')');
  };

  Color.prototype._extractChannels = function() {
    var channels = {
      r: {amount: 0, total: 0},
      g: {amount: 0, total: 0},
      b: {amount: 0, total: 0},
    };

    for (var i = 0; i < (this._img.width * this._img.height); i += 4) {
      if (this._data[i + 3] < (255 / 2)) {
        continue;
      }

      var iterator = i;

      for (var key in channels) {
        channels[key].amount++;
        channels[key].total += this._data[iterator];

        iterator++;
      }
    }

    return channels;
  };

  Color.prototype._extractColorBlocks = function() {
    var colors = {};

    for (var i = 0; i < (this._img.width * this._img.height); i += 4) {
      if (this._data[i + 3] < (255 / 2)) {
        continue;
      }

      var color = [];

      for (var iterator = i; iterator <= i + 2; iterator++) {
        color.push(_roundTo20(this._data[i + iterator]));
      }

      color = color.join(', ');

      if (color in colors) {
        colors[color]++;
      } else {
        colors[color] = 1;
      }
    }

    return colors;
  };

  /**
   * External API
   */

  Color.prototype.average = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback is not provided.');
    }

    this._callbacks.push({
      call: callback,
      method: this._average,
    });

    if (! this._running) {
      this._runCallbacks();
    }
  };

  Color.prototype.mostUsed = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback is not provided.');
    }

    this._callbacks.push({
      call: callback,
      method: this._mostUsed,
    });

    if (! this._running) {
      this._runCallbacks();
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
