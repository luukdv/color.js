(function(root) {
  'use strict';

  var Color = function(item, args) {
    this._callbacks = [];
    this._colors = null;
    this._data = null;
    this._img = null;
    this._running = true;
    this._url = null;

    var args = args || {};

    this.amount = args.amount || 3;
    this.format = args.format || 'rgb';
    this.group = args.group || 20;
    this.sample = args.sample || 10;

    if (typeof item === 'function') {
      item = item();
    }

    if (typeof item === 'object' && item.src) {
      this._url = item.src;
    } else if (typeof item === 'string') {
      this._url = item;
    } else {
      throw new TypeError('Invalid image type.');
    }

    this._createImage();
  };

  /**
   * Internals: helpers
   */

  Color.prototype._rgbToHex = function(r, g, b) {
    return '#' + [r, g, b].map(function(value) {
      var hex = parseInt(value).toString(16);

      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  Color.prototype._format = function(colors) {
    switch (this.format) {
      case 'array':
        colors.forEach(function(color, i) {
          colors[i] = color.split(', ');
        });

        break;
      case 'hex':
        colors.forEach(function(color, i) {
          var rgb = color.split(', ');

          colors[i] = this._rgbToHex(rgb[0], rgb[1], rgb[2]);
        }, this);

        break;
      default:
        colors.forEach(function(color, i) {
          colors[i] = 'rgb(' + color.split(',') + ')';
        });

        break;
    }

    if (colors.length === 1) {
      return colors[0];
    }

    return colors;
  };

  Color.prototype._roundToGroups = function(number) {
    var value = Math.round(number / this.group) * this.group;

    if (value >= 255) {
      return 255;
    }

    return value;
  };

  /**
   * Internals: retrieve image data
   */

  Color.prototype._createImage = function() {
    this._img = document.createElement('img');
    this._img.crossOrigin = 'Anonymous';
    this._img.src = this._url;

    this._img.addEventListener('load', function() {
      this._createCanvas();

      this._running = false;
      this._runCallbacks();
    }.bind(this));
  };

  Color.prototype._createCanvas = function() {
    var canvas = document.createElement('canvas');

    if (typeof canvas.getContext === 'undefined') {
      throw new Error('HTML5 canvas is not supported.');
    }

    var context = canvas.getContext('2d');

    canvas.height = this._img.height;
    canvas.style.display = 'none';
    canvas.width = this._img.width;
    context.drawImage(this._img, 0, 0);

    document.body.appendChild(canvas);

    var info = context.getImageData(0, 0, this._img.width, this._img.height);
    this._data = info.data;

    document.body.removeChild(canvas);
  };

  Color.prototype._runCallbacks = function() {
    this._callbacks.forEach(function(cb, key) {
      this._callbacks[key].method.call(this, this._callbacks[key].call);
    }, this);

    this._callbacks = [];
  };

  /**
   * Internals: color extraction
   */

  Color.prototype._extractChannels = function() {
    var channels = {
      amount: 0,
      colors: {r: 0, g: 0, b: 0},
    };

    for (var i = 0; i < this._data.length; i += (4 * this.sample)) {
      if (this._data[i + 3] < (255 / 2)) {
        continue;
      }

      var iterator = i;

      channels.amount++;

      for (var key in channels.colors) {
        channels.colors[key] += this._data[iterator];
        iterator++;
      }
    }

    return channels;
  };

  Color.prototype._extractColorGroups = function() {
    var colors = {};
    var colorList = [];

    for (var i = 0; i < this._data.length; i += (4 * this.sample)) {
      if (this._data[i + 3] < (255 / 2)) {
        continue;
      }

      var rgb = [
        this._roundToGroups(this._data[i]),
        this._roundToGroups(this._data[i + 1]),
        this._roundToGroups(this._data[i + 2]),
      ].join(', ');

      if (rgb in colors) {
        colors[rgb]++;
      } else {
        colors[rgb] = 1;
      }
    }

    for (var color in colors) {
      colorList.push({
        color: color,
        count: colors[color],
      });
    }

    return colorList.sort(function(a, b) {
      if (a.count < b.count) {
        return 1;
      } else if (a.count > b.count) {
        return -1;
      }

      return 0;
    });
  };

  /**
   * Internals: API functions
   */

  Color.prototype._average = function(callback) {
    var colors = [];
    var channels = this._extractChannels();

    for (var key in channels.colors) {
      colors.push(Math.round(channels.colors[key] / channels.amount));
    }

    colors = [colors.join(', ')];

    callback(this._format(colors));
  };

  Color.prototype._process = function(callback, apply) {
    if (!this._colors) {
      this._colors = this._extractColorGroups();
    }

    var colors = [];

    apply(colors);
    callback(this._format(colors));
  };

  Color.prototype._leastUsed = function(callback) {
    this._process(callback, function(colors) {
      for (var i = 1; i <= this.amount; i++) {
        if (!this._colors[this._colors.length - i]) {
          continue;
        }

        colors.push(this._colors[this._colors.length - i].color);
      }
    }.bind(this));
  };

  Color.prototype._mostUsed = function(callback) {
    this._process(callback, function(colors) {
      for (var i = 0; i < this.amount; i++) {
        if (!this._colors[i]) {
          continue;
        }

        colors.push(this._colors[i].color);
      }
    }.bind(this));
  };

  /**
   * Internals: API call
   */

  Color.prototype._call = function(callback, method) {
    if (typeof callback !== 'function') {
      throw new ReferenceError('Callback is not provided.');
    }

    if (this._running) {
      this._callbacks.push({
        call: callback,
        method: method,
      });
    } else {
      method.call(this, callback);
    }
  };

  /**
   * External API
   */

  Color.prototype.average = function(callback) {
    this._call(callback, this._average);
  };

  Color.prototype.leastUsed = function(callback) {
    this._call(callback, this._leastUsed);
  };

  Color.prototype.mostUsed = function(callback) {
    this._call(callback, this._mostUsed);
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
