import { mapObject } from '.'

describe('mapObject', () => {
  it('maps object values', () => {
    expect(
      mapObject(([key, value]) => [key, value ** 2], { a: 1, b: 4 }),
    ).toEqual({ a: 1, b: 16 })
  })

  it('maps object keys', () => {
    expect(
      mapObject(
        ([key, value]) => [`${key[0].toUpperCase()}${key.slice(1)}`, value],
        { yurick: true, natalia: false },
      ),
    ).toEqual({ Yurick: true, Natalia: false })
  })

  it('maps object keys and values', () => {
    expect(
      mapObject(([key, value]) => [`square(${key})`, value ** 2], {
        two: 2,
        six: 6,
      }),
    ).toEqual({
      'square(two)': 4,
      'square(six)': 36,
    })
  })
})
