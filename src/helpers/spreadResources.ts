import { Resource, KeysOf } from '../types'

export const spreadResources = <
  Context,
  Resources extends Resource<Path, Context>[],
  Path extends string = any
>(
  resources: Resources,
): Resource<Resources extends (infer R)[] ? KeysOf<R> : never, Context> => {
  return resources.reduce(
    (acc, curr) => ({
      ...acc,
      ...curr,
    }),
    {},
  )
}
