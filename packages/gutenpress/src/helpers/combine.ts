import { Resource, KeysOf } from '../types'

export const combine = <
  Context,
  Resources extends Resource<Path, Context>[],
  Path extends string = any
>(
  resources: Resources,
): Resource<Resources extends (infer R)[] ? KeysOf<R> : never, Context> => {
  // TODO: merge methods that belong to the same path together
  return resources.reduce(
    (acc, curr) => ({
      ...acc,
      ...curr,
    }),
    {},
  )
}
