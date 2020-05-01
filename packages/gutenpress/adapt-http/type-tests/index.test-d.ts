import { get } from '@gutenpress/core'
import * as http from 'http'
import { expectError, expectType } from 'tsd'
import { toRouter, toRouterWithConfig } from '../src'

/** Test: toRouter accepts only gutenpress resources */
{
  toRouter([])
  toRouter([get('/', () => 10)])

  const transform = toRouterWithConfig({ initialContextBuilder: () => 10 })
  transform([])
  transform([
    get('/', ({ context }) => {
      expectType<number>(context)
      return context
    }),
  ])
}

/** Test: toRouter injects the correct initial context */
{
  expectType<(req: http.IncomingMessage, res: http.ServerResponse) => void>(
    toRouter([get('/', () => 10)]),
  )

  expectError(
    toRouter([
      get(
        '/',
        ({ context }: { context: { potato: string } }) => context.potato,
      ),
    ]),
  )

  expectType<(req: http.IncomingMessage, res: http.ServerResponse) => void>(
    toRouterWithConfig({
      initialContextBuilder: () => ({ potato: 'solid' }),
    })([
      get('/', ({ context }) => {
        expectType<{ potato: string }>(context)
      }),
    ]),
  )

  expectError(
    toRouterWithConfig({
      initialContextBuilder: () => ({ potato: 'solid' }),
    })([get('/', ({ context }) => context.solid)]),
  )
}
