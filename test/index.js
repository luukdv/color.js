import { average, prominent } from '../src'

it('Calculates the average color', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg'))
    .then((data) => expect(data).to.deep.equal([182, 180, 208]))
})

it('Calculates the average color with a less strict sample size', () => {
  cy.wrap(average('http://localhost:9000/sand.jpg', { sample: 50 }))
    .then((data) => expect(data).to.deep.equal([182, 180, 207]))
})
