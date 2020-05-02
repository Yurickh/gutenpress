import { expectType } from 'tsd'
import { combine, get } from '../src'

/** Test: combine keeps the resource paths in the final type */
{
  const a = get('/a', () => 'a')
  const b = get('/b', () => 'b')

  const c = combine([a, b])
  const paths = Object.keys(c) as (keyof typeof c)[]

  expectType<('/a' | '/b')[]>(paths)

  expectType<typeof a['/a']>(c['/a'])
  expectType<typeof b['/b']>(c['/b'])
}
