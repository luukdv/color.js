import { average, prominent } from '../src'

it('Extracts the average color', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg'))
    .then((data) => expect(data).to.deep.equal([183, 180, 208]))
})

it('Extracts the prominent color', () => {
  cy.wrap(prominent('http://localhost:9000/pills.jpg', { amount: 1, group: 1 }))
    .then((data) => expect(data).to.deep.equal([237, 140, 0]))
})

it('Extracts the color from a DOM element', () => {
  const img = document.createElement('img')

  img.src = 'http://localhost:9000/pills.jpg'
  document.body.appendChild(img)

  cy.wrap(average(img))
    .then((data) => expect(data).to.deep.equal([233, 155, 42]))
})

it('Extracts 3 prominent colors', () => {
  cy.wrap(prominent('http://localhost:9000/faces.jpg', { amount: 3, group: 28 }))
    .then((data) => expect(data).to.deep.equal([
      [0, 0, 0], // Black
      [224, 0, 0], // Red
      [0, 252, 252], // Blue
    ]))
})

it('Extracts the average color with a strict sample size', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { sample: 1 }))
    .then((data) => expect(data).to.deep.equal([182, 180, 208]))
})

it('Extracts the average color with a loose sample size', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { sample: 50 }))
    .then((data) => expect(data).to.deep.equal([182, 180, 207]))
})

it('Returns the color in hexadecimal format', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { format: 'hex' }))
    .then((data) => expect(data).to.equal('#b7b4d0'))
})

it('Returns the default format when an invalid format is provided', () => {
  cy.wrap(average('http://localhost:9000/faces.jpg', { format: 'invalid' }))
    .then((data) => expect(data).to.deep.equal([54, 38, 42]))
})
