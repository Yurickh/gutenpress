import { expectType } from 'tsd'
import { combine, get, Resource } from '../src'

/** Test: combine keeps the resource paths in the final type */
{
  const a = get('/a', () => 'a')
  const b = get('/b', () => 'b')

  expectType<Resource<'/a' | '/b', unknown>>(combine([a, b]))
}
