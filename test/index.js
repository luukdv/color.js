import { average, prominent } from '../src'

it('Extracts the average color', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg'))
    .then((data) => expect(data).to.deep.equal([183, 180, 208]))
})

it('Extracts the prominent color', () => {
  cy.wrap(prominent('http://localhost:9000/sand.jpg', { amount: 1 }))
    .then((data) => expect(data).to.deep.equal([140, 140, 180]))
})

it('Extracts prominent colors', () => {
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

it('Extracts the average color with a less strict sample size', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { sample: 50 }))
    .then((data) => expect(data).to.deep.equal([182, 180, 207]))
})

it('Returns the color in hexadecimal format', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { format: 'hex' }))
    .then((data) => expect(data).to.equal('#b7b4d0'))
})
