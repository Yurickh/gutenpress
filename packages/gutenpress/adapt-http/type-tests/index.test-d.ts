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
      // COMBAK: this is breaking due to tsd not having the same inference as ts
      // Ideally, we would create a minimal repro to open an issue against them,
      // but I couldn't manage to do it
      // expectType<number>(context)
      return context
    }),
  ])
}

/** Test: toRouter injects the correct initial context */
{
  expectType<
    (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      next?: () => void,
    ) => void
  >(toRouter([get('/', () => 10)]))

  expectError(
    toRouter([
      get(
        '/',
        ({ context }: { context: { potato: string } }) => context.potato,
      ),
    ]),
  )

  expectType<
    (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      next?: () => void,
    ) => void
  >(
    toRouterWithConfig({
      initialContextBuilder: () => ({ potato: 'solid' }),
    })([
      get('/', () => {
        // COMBAK: this is breaking due to tsd not having the same inference as ts
        // Ideally, we would create a minimal repro to open an issue against them,
        // but I couldn't manage to do it
        // expectType<{ potato: string }>(context)
      }),
    ]),
  )

  // COMBAK: this is breaking due to tsd not having the same inference as ts
  // Ideally, we would create a minimal repro to open an issue against them,
  // but I couldn't manage to do it
  // expectError(
  //   toRouterWithConfig({
  //     initialContextBuilder: () => ({ potato: 'solid' }),
  //   })([get('/', ({ context }) => context.solid)]),
  // )
}
