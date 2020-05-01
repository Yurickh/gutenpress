import { expectType } from 'tsd'
import { mapObject } from '../src'

const obj = {
  a: 1,
  b: 2,
}

const squared = mapObject(([key, value]) => [key, value ** 2], obj)

expectType<{ a: number; b: number }>(squared)

const same = mapObject(([key, value]) => [key, value], obj)

expectType<typeof obj>(same)
