import { mapObject, UnionToIntersection } from '@gutenpress/helpers'
import { Resource, KeysOf, MethodGroup, SingleResource } from '../types'

export type Combine<Resources extends SingleResource<any, any, any, any>[]> = {
  [path in keyof UnionToIntersection<Resources[number]>]: {
    [method in keyof UnionToIntersection<
      Resources[number]
    >[path]]: UnionToIntersection<Resources[number]>[path][method]
  }
}

export const combine = <
  Resources extends Resource<string, any>[],
  ResourcePath extends string = Resources extends (infer R)[]
    ? KeysOf<R>
    : never
>(
  resources: Resources,
): Combine<Resources> => {
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
          ] as [
            ResourcePath,
            MethodGroup<
              Resources extends Resource<any, infer Context> ? Context : never
            >,
          ],
        acc,
      ),
    }),
    {},
  ) as Combine<Resources>
}
