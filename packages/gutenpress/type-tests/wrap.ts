import { get, wrap } from '../src'

/** Test: nested wraps receives parent context */

{
  wrap(() => ({ potato: 'solid' }), [
    get('/', ({ context }) => context.potato),
    // typings:expect-error
    get('/error', ({ context }) => context.roberto),

    wrap(({ context }) => ({ ...context, solid: 'potato' }), [
      get(
        '/nested',
        // You need to define the type of the context, so it is not "unknown"
        ({ context }: { context: { potato: string; solid: string } }) =>
          context.potato + context.solid,
      ),

      // typings:expect-error
      get(
        '/nested/error',
        ({ context }: { context: { roberto: string } }) => context.roberto,
      ),
    ]),
  ])
}
