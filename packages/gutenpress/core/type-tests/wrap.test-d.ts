import { expectError } from 'tsd'
import { get, wrap } from '../src'

/** Test: nested methods receives parent context */

{
  expectError(
    wrap(() => ({ potato: 'solid' }), [
      get('/error', ({ context }: { context: { roberto: string } }) => {
        context.roberto
      }),
    ]),
  )

  wrap(() => ({ potato: 'solid' }), [
    get('/', ({ context }) => context.potato),

    wrap(
      // You need to define the type of the context, so it is not "unknown"
      ({ context }: { context: { potato: string } }) => ({
        ...context,
        solid: 'potato',
      }),
      [get('/nested', ({ context }) => context.potato + context.solid)],
    ),
  ])

  expectError(
    wrap(() => ({ potato: 'solid' }), [
      get(
        '/nested/error',
        ({ context }: { context: { roberto: string } }) => context.roberto,
      ),
    ]),
  )
}
