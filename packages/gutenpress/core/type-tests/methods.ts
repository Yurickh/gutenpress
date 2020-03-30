import { get, post, wrap } from '../src'

/** Test: get() doesn't accept an action that expects a body */

// When declared inline
{
  get('/:id', ({ query }) => query)
  // typings:expect-error
  get('/', ({ body, context }) => ({
    potato: body.potato,
    solid: context,
  }))
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
  // typings:expect-error
  get('/', bodyfullAction)
}

/** Test: methods don't accept actions that expect more context than it currently has */

// When loose
{
  wrap(() => ({ potato: 'solid' }), [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { potato } }) => potato),
  ])

  // typings:expect-error
  get('/', ({ context }) => context.potato)
  // typings:expect-error
  post('/', ({ context: { potato } }) => potato)
}

// When inside of a mismatching context
{
  // It accepts partial usage of the context
  wrap(() => ({ potato: 'solid', solid: 'potato' }), [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { solid } }) => solid),
  ])

  wrap(() => ({ potato: 'solid' }), [
    // typings:expect-error
    get('/', ({ context }) => context.solid),
    // typings:expect-error
    post('/', ({ context: { solid } }) => solid),
  ])
}

// When context is declared through a variable rather than inline
{
  const wrapper = () => ({ potato: 'solid' })

  wrap(wrapper, [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { potato } }) => potato),

    // typings:expect-error
    get('/error', ({ context }) => context.solid),
    // typings:expect-error
    post('/error', ({ context: { solid } }) => solid),
  ])
}
