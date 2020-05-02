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

/** Test: wrap works with autocompletion */
// {
//   const a = get('/a', ({ context }) => 'a' + context)
//   const b = get('/b', ({ context }) =>
//     context ? 13 : new BadRequestError('ih'),
//   )
//   const a2 = post('/a', () => 'a2')

//   const wrapped = wrap(() => 'context', [a, b, a2])

//   expectType<{
//     '/a': {
//       GET: (p: RequestParams<{}, 'GET'>) => string
//       POST: (p: RequestParams<{}, 'POST'>) => string
//     }
//     '/b': { GET: (p: RequestParams<{}, 'GET'>) => number | BadRequestError }
//   }>(wrapped)
// }

// /** Test: wrap properly handles the error type */
// {
//   const a = get('/a', ({ context }) => 'a' + context)
//   const wrapper = ({ body }: { body: { token?: string } }) =>
//     body.token ?? new BadRequestError('please provide token')

//   const wrapped = wrap(wrapper, [a])

//   expectType<{
//     '/a': {
//       GET: (p: RequestParams<{}, 'GET'>) => string | BadRequestError
//     }
//   }>(wrapped)
// }
