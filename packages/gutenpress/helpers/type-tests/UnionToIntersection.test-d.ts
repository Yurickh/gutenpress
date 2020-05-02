import { expectType } from 'tsd'
import { UnionToIntersection } from '../src'

type A = { a: 1 }
type B = { b: 2 }

const intersection: UnionToIntersection<A | B> = { a: 1, b: 2 }
expectType<A & B>(intersection)
