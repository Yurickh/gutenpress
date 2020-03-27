import { Resource, KeysOf, MethodGroup } from '../types'
import { fromEntries } from './fromEntries'

export const combine = <
  Context,
  Resources extends Resource<Path, Context>[],
  Path extends string = any,
  ResourcePath extends string = Resources extends (infer R)[]
    ? KeysOf<R>
    : never
>(
  resources: Resources,
) => {
  return resources.reduce(
    (acc, curr) => ({
      // add any new paths
      ...curr,
      // and extends existing paths with the new methods
      ...fromEntries<Resource<ResourcePath, Context>>(
        Object.entries<MethodGroup<Context>>(acc).map(([path, methodGroup]) => [
          path as ResourcePath,
          {
            ...methodGroup,
            // NOTE: this is kind of a hack, as `path` is not necessarily present in `curr`
            // but spreading undefined is a no-op so we're virtually safe in this operation.
            ...curr[path as keyof typeof curr],
          },
        ]),
      ),
    }),
    {} as Resource<ResourcePath, Context>,
  )
}
