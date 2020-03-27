import { get } from '../src'

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
