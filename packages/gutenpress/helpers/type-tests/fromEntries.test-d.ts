import { expectType, expectError } from 'tsd'
import { fromEntries } from '../src'

/** Test: enforces its signature */
{
  expectType<{ a: 1; b: 2 }>(
    fromEntries([
      ['a', 1],
      ['b', 2],
    ]),
  )

  expectError(
    fromEntries({
      a: 1,
      b: 2,
    }),
  )
}

/** Test: returns an object with the given properties */
{
  const result = fromEntries([
    ['a', 1],
    ['b', 2],
  ])

  expectType<1>(result.a)

  expectError(result.c)
}
