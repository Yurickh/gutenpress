import { get, post } from '@gutenpress/core'
import { toClientDefinition } from '.'

describe('toClientDefinition', () => {
  it('works for simple use cases', () => {
    const resources = [get('/order', () => 10), post('/order', () => 10)]

    expect(toClientDefinition(resources)).toEqual({
      Order: {
        all: { method: 'GET', path: '/order' },
        create: { method: 'POST', path: '/order' },
      },
    })
  })
})