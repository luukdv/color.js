# Color.js

Extract colors from an image using JavaScript. Images that are already present in the DOM are supported, as well as (external) URL's.

## Install

Manually:

```html
<script src="dist/color.js"></script>
```

## Usage:

```js
const color = new Color('js-logo.jpg', {
  amount: 1
});

color.mostUsed((result) => {
  console.log(result); // rgb(241, 221, 63)
});
```

## Options

You can pass two arguments, an image and a configuration `object`.

### Image (required)

Can be a DOM element or a URL.

```js
const img = document.getElementById('image');
const color = new Color(img);
```

```js
const color = new Color('image.jpg');
```

```js
const color = new Color('https://unsplash.com/example.jpg');
```

When using an external image, CORS should of course be enabled on the source.

### Configuration (optional)

The default configuration options. Explanations of each option can be found below.

```js
{
  amount: 3,
  format: 'rgb',
  sample: 10,
  blocks: 20,
}
```

#### Amount

The amount of colors that should be returned. When set to `1` a singular value is returned, otherwise an `array` of values.

#### Format

The format in which colors should be returned. Options are `'rgb'` (default), `'hex'` and `'array'`.

```js
'rgb(241, 221, 63)' // 'rgb'
'#f1dd3f' // 'hex'
[241, 221, 63] // 'array'
```

## API

### Average

### Most used

### Least used
