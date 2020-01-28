import { fromEntries } from './helpers/fromEntries'

const prefixAPI = (prefix: string) => <API>(
  api: Record<string, API>,
): Record<string, API> =>
  fromEntries(
    Object.entries(api).map(([path, methods]) => [`${prefix}${path}`, methods]),
  )

const combineAPIs = <Source, Target>(
  sourceAPI: Record<string, Source>,
  targetAPI: Record<string, Target>,
): Record<string, Source & Target> => {
  const allPaths = new Set([
    ...Object.keys(sourceAPI),
    ...Object.keys(targetAPI),
  ])

  return fromEntries(
    Array.from(allPaths).map(path => [
      path,
      {
        ...sourceAPI[path],
        ...targetAPI[path],
      },
    ]),
  )
}

const mergeAPIs = <API>(apis: Record<string, API>[]): Record<string, API> =>
  apis.reduce(combineAPIs, {})

export const path = <Prefix extends string, Path extends string, Resource>(
  prefix: Prefix,
  apis: Record<Path, Resource>[],
): Record<Path, Resource> => mergeAPIs(apis.map(prefixAPI(prefix)))
