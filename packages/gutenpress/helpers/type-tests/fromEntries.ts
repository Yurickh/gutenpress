import { fromEntries } from '../src'

/** Test: enforces its signature */
{
  fromEntries([
    ['a', 1],
    ['b', 2],
  ])

  // typings:expect-error
  fromEntries({
    a: 1,
    b: 2,
  })
}

/** Test: returns an object with the given properties */
{
  const result = fromEntries([
    ['a', 1],
    ['b', 2],
  ])

  result.a
  // typings:expect-error
  result.c
}
