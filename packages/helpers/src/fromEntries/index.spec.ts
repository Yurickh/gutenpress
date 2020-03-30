import { fromEntries } from '.'

describe('fromEntries', () => {
  it('creates an object from its entries', () => {
    expect(
      fromEntries([
        ['a', 1],
        ['b', 2],
      ]),
    ).toEqual({
      a: 1,
      b: 2,
    })
  })

  it('is the inversion of Object.entries', () => {
    const myobj = {
      potato: 'solid',
      solid: {
        nested: true,
      },
    }

    expect(fromEntries(Object.entries(myobj))).toEqual(myobj)
  })
})
