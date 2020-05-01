import { expectError } from 'tsd'
import { get, wrap } from '../src'

/** Test: nested wraps receives parent context */

{
  expectError(
    wrap(() => ({ potato: 'solid' }), [
      get('/error', ({ context }) => context.roberto),
    ]),
  )

  // FIXME: #23
  // wrap(() => ({ potato: 'solid' }), [
  //   get('/', ({ context }) => context.potato),

  //   wrap(({ context }) => ({ ...context, solid: 'potato' }), [
  //     get(
  //       '/nested',
  //       // You need to define the type of the context, so it is not "unknown"
  //       ({ context }) => context.potato + context.solid,
  //     ),
  //   ]),
  // ])

  expectError(
    wrap(() => ({ potato: 'solid' }), [
      get(
        '/nested/error',
        ({ context }: { context: { roberto: string } }) => context.roberto,
      ),
    ]),
  )
}
