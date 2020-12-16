# color.js

Extract colors from an image. Works in the browser and in hybrid environments like Electron. Supports images that are present in the DOM, as well as (external) URL's. Size: ~0.75 KB (min + gzip).

## Installation

```sh
npm install color.js
```

Or directly in the browser:

```html
<script src="https://unpkg.com/color.js@1.2.0/dist/color.js"></script>
```

## Usage example:

```js
import { prominent } from 'color.js'

prominent('js-logo.jpg', { amount: 1 }).then(color => {
  console.log(color) // [241, 221, 63]
})

// Or with different syntax:

const color = await prominent('js-logo.jpg', { amount: 1 })
console.log(color) // [241, 221, 63]
```

When used directly in the browser:

```html
<script src="https://unpkg.com/color.js@1.2.0/dist/color.js"></script>
```

```js
colorjs.prominent('js-logo.jpg', { amount: 1 }).then(color => {
  console.log(color) // [241, 221, 63]
})
```

## API

### Prominent

Returns the most used color(s) in an image. Can be requested as a single color or palette of colors (see [amount](#amount)).

```js
import { prominent } from 'color.js'

prominent('img.jpg').then(colors => ...)
```

![Prominent](img/prominent.jpg)

### Average

Returns the average color of an image.

```js
import { average } from 'color.js'

average('img.jpg').then(color => ...)
```

![Average](img/average.jpg)

## Options

You can pass two arguments, an image and a [configuration](#configuration-optional) `object`.

### Image (required)

Can be a URL or DOM element.

```js
average('img.jpg')
```

```js
const img = document.getElementById('photo')
average(img)
```

```js
average('https://example.com/image.jpg')
```

When using an external image, [CORS](https://enable-cors.org/) should of course be enabled on the source.

### Configuration (optional)

#### Amount

**Default:** `3`

Only applicable for [prominent](#prominent).

The amount of colors that should be returned. When set to `1` a singular value is returned, otherwise an `array` of values.

```js
prominent('img.jpg', { amount: 5 })
```

#### Format

**Default:** `'array'`

The format in which colors should be returned. Options are `'array'` and `'hex'`.

```js
[241, 221, 63] // 'array'
'#f1dd3f' // 'hex'
```

```js
average('img.jpg', { format: 'hex' })
```

#### Group

**Default:** `20`

Configures how many similar colors should be combined into one color. A value of `1` would mean _every_ individual color would be considered, but this is often not ideal. Especially in photographs there's usually a lot of color data, and grouping colors could give more usable results. In the first example below, `group` is set to `5` and a lot of individual colors in the sea are returned. When more grouping is applied (`30` in the second example), the results become more distinct.

```js
prominent('img.jpg', { group: 30 })
```

![Group](img/group.jpg)

#### Sample

**Default:** `10`

Configures how many pixels of an image should be processed. For example, a value of `20` means every 20th pixel is interpreted. A higher value means less accurate results, but better performance. An example of default sampling on an image:

```js
average('img.jpg', { sample: 10 })
```

![Sample](img/sample.jpg)

## Browser support

Pretty much everything (> 0.2%), except for IE.
