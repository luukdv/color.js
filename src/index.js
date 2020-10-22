const getSrc = (item) => typeof item === 'object' && item.src ? item.src : item

const getArgs = ({
  amount = 10,
  format = 'rgb',
  group = 20,
  sample = 10,
} = {}) => ({ amount, format, group, sample })

const rgbToHex = (rgb) => '#' + rgb.map((value) => {
  const hex = parseInt(value).toString(16);

  return hex.length === 1 ? '0' + hex : hex;
}).join('')

const getImageData = (src) => new Promise((resolve, reject) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image

  img.onload = () => {
    canvas.style.display = 'none'
    canvas.height = img.height
    canvas.width = img.width

    document.body.appendChild(canvas)
    context.drawImage(img, 0, 0)

    const data = context.getImageData(0, 0, img.width, img.height).data

    document.body.removeChild(canvas)
    resolve(data)
  }
  img.onerror = () => reject(Error('Image loading failed.'))
  img.crossOrigin = ''
  img.src = src
})

const extractAverage = (data, args) => {
  const interval = 4 * args.sample
  const amount = data.length / interval
  const rgb = { r: 0, g: 0, b: 0 }

  for (let i = 0; i < data.length; i += interval) {
    rgb.r += data[i]
    rgb.g += data[i + 1]
    rgb.b += data[i + 2]
  }

  return [
    Math.round(rgb.r / amount),
    Math.round(rgb.g / amount),
    Math.round(rgb.b / amount)
  ]
}

const extractGroups = (data, args) => {
}

const process = (item, args, fn) => new Promise((resolve, reject) =>
  getImageData(getSrc(item))
    .then((data) => resolve(fn(data, getArgs(args))))
    .catch((error) => reject(error))
)

const average = (item, args) => process(item, args, extractAverage)
const prominent = (item, args) => process(item, args, extractGroups)

export { average, prominent }
