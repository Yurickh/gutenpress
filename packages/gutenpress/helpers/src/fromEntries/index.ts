/**
 * Adapted from:
 * @author https://gist.github.com/karol-majewski
 * @see https://gist.github.com/karol-majewski/b234a4aceb8884ccc1acf25a2e1ed16e
 */

type Primitive = boolean | number | string | bigint | symbol | null | undefined

type Narrowable = Primitive | object | {}

type Entry<K extends PropertyKey, V> = [K, V]

/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never

type FromEntries<
  T extends Entry<K, V>,
  K extends PropertyKey,
  V extends Narrowable
> = UnionToIntersection<
  T extends [infer Key, infer Value]
    ? Key extends PropertyKey
      ? { [k in Key]: Value }
      : never
    : never
>

export function fromEntries<
  T extends Entry<K, V>,
  K extends PropertyKey,
  V extends Narrowable
>(
  entries: Iterable<T>,
): { [k in keyof FromEntries<T, K, V>]: FromEntries<T, K, V>[k] } {
  return [...entries].reduce(
    (accumulator, [key, value]) =>
      Object.assign(accumulator, {
        [key.toString()]: value,
      }),
    {} as FromEntries<T, K, V>,
  )
}
