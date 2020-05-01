import { expectError, expectType } from 'tsd'
import { get, post, wrap } from '../src'
import { Resource } from '../src/types'

/** Test: get() doesn't accept an action that expects a body */

// When declared inline
{
  expectType<Resource<'/:id', unknown>>(get('/:id', ({ query }) => query))

  expectError(
    get('/', ({ body, context }) => ({
      potato: body.potato,
      solid: context,
    })),
  )
}

// When passed as a function
{
  const bodylessAction = ({ context }: { context: number }) => context
  get('/', bodylessAction)

  const bodyfullAction = ({
    body,
    context,
  }: {
    body: { potato: string }
    context: number
  }) => ({
    potato: body.potato,
    solid: context,
  })

  expectError(get('/', bodyfullAction))
}

/** Test: methods don't accept actions that expect more context than it currently has */

// When loose
{
  wrap(() => ({ potato: 'solid' }), [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { potato } }) => potato),
  ])

  expectError(post('/', ({ context: { potato } }) => potato))
}

// When inside of a mismatching context
{
  // It accepts partial usage of the context
  wrap(() => ({ potato: 'solid', solid: 'potato' }), [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { solid } }) => solid),
  ])

  expectError(
    wrap(() => ({ potato: 'solid' }), [
      get('/', ({ context }) => context.solid),
    ]),
  )

  expectError(
    wrap(() => ({ potato: 'solid' }), [
      post('/', ({ context: { solid } }) => solid),
    ]),
  )
}

// When context is declared through a variable rather than inline
{
  const wrapper = () => ({ potato: 'solid' })

  wrap(wrapper, [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { potato } }) => potato),
  ])

  expectError(wrap(wrapper, [get('/error', ({ context }) => context.solid)]))
  expectError(
    wrap(wrapper, [post('/error', ({ context: { solid } }) => solid)]),
  )
}
