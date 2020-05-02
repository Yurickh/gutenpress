import { mapObject } from '@gutenpress/helpers'
import { Resource, KeysOf, MethodGroup } from '../types'

export const combine = <
  Context,
  Resources extends Resource<string, Context>[],
  ResourcePath extends string = Resources extends (infer R)[]
    ? KeysOf<R>
    : never
>(
  resources: Resources,
): Resource<ResourcePath, Context> => {
  return resources.reduce(
    (acc, curr) => ({
      // add any new paths
      ...curr,
      // and extends existing paths with the new methods
      ...mapObject(
        ([path, methodGroup]) =>
          [
            path,
            {
              ...methodGroup,
              // NOTE: this is kind of a hack, as `path` is not necessarily present in `curr`
              // but spreading undefined is a no-op so we're virtually safe in this operation.
              ...curr[path as keyof typeof curr],
            },
          ] as [ResourcePath, MethodGroup<Context>],
        acc,
      ),
    }),
    {},
  )
}
