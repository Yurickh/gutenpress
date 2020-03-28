import { get } from 'gutenpress'
import { toRouter, toRouterWithConfig } from '../src'

/** Test: toRouter accepts only gutenpress resources */
{
  toRouter([])
  toRouter([get('/', () => 10)])

  // typings:expect-error
  toRouter([1, 2, 3])

  const transform = toRouterWithConfig({ initialContextBuilder: () => 10 })
  transform([])
  transform([get('/', ({ context }) => context)])
}

/** Test: toRouter injects the correct initial context */
{
  toRouter([
    get('/', () => 10),
    // typings:expect-error
    get('/', ({ context }: { context: { potato: string } }) => context.potato),
  ])

  toRouterWithConfig({
    initialContextBuilder: () => ({ potato: 'solid' }),
  })([
    get('/', ({ context }: { context: { potato: string } }) => context.potato),
    // typings:expect-error
    get('/', ({ context }: { context: { solid: string } }) => context.solid),
  ])
}
