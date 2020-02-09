import { fromEntries } from './helpers/fromEntries'

const prefixResourcePaths = (prefix: string) => <
  Resource extends Record<string, unknown>
>(
  resource: Resource,
): Resource =>
  fromEntries(
    Object.entries(resource).map(([path, methods]) => [
      `${prefix}${path}`,
      methods,
    ]),
  ) as Resource

const combineResources = <Source, Target>(
  sourceResource: Record<string, Source>,
  targetResource: Record<string, Target>,
): Record<string, Source & Target> => {
  const allPaths = new Set([
    ...Object.keys(sourceResource),
    ...Object.keys(targetResource),
  ])

  return fromEntries(
    Array.from(allPaths).map(path => [
      path,
      {
        ...sourceResource[path],
        ...targetResource[path],
      },
    ]),
  )
}

const mergeResources = <Resource>(
  resources: Record<string, Resource>[],
): Record<string, Resource> => resources.reduce(combineResources, {})

// TODO: fix these typs
export const path = <Resource extends Record<string, unknown>>(
  prefix: string,
  resources: Resource[],
): Resource =>
  mergeResources(resources.map(prefixResourcePaths(prefix))) as Resource
