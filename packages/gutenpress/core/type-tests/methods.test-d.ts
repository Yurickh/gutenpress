import { expectError, expectType } from 'tsd'
import { get, post, wrap, RequestParams } from '../src'

/** Test: get() doesn't accept an action that expects a body */

// When declared inline
{
  expectType<{ '/:id': { GET: (params: RequestParams<any, 'GET'>) => any } }>(
    get('/:id', ({ query }) => query),
  )

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

// When inside of a mismatching context
{
  // It accepts partial usage of the context
  wrap(() => ({ potato: 'solid', solid: 'potato' }), [
    get('/', ({ context }) => context.potato),
    post('/', ({ context: { solid } }) => solid),
  ])

  // COMBAK: this is breaking due to tsd not having the same inference as ts
  // Ideally, we would create a minimal repro to open an issue against them,
  // but I couldn't manage to do it
  // wrap(() => ({ potato: 'solid' }), [
  //   get('/', ({ context }) => {
  //     expectType<{ potato: string }>(context)
  //   }),
  // ])
  // expectError(
  //   wrap(() => ({ potato: 'solid' }), [
  //     post('/', ({ context: { solid } }) => solid),
  //   ]),
  // )
}
