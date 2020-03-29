import { Resource, HTTPMethod } from '@gutenpress/core'

const methodGroupToActionList = <Path extends string, R extends Resource<Path>>(
  path: Path,
  methodGroup: R[Path],
): [Path, HTTPMethod][] =>
  Object.keys(methodGroup).map(method => [path, method as HTTPMethod])

export const resourceToDefinition = (resource: Resource<any, any>) => {
  const actionList = Object.entries(resource).reduce(
    (acc, [path, methodGroup]) => [
      ...acc,
      ...methodGroupToActionList(path, methodGroup),
    ],
    [] as [string, HTTPMethod][],
  )

  const tokenizedPaths = actionList.map(([path]) =>
    path.split('/').filter(token => token.length > 0),
  )
  const topLevelResources = [...new Set(tokenizedPaths.map(path => path[0]))]

  return topLevelResources.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: actionList.filter(([path]) =>
        new RegExp(`^/?${curr}`).test(path),
      ),
    }),
    {},
  )
}
