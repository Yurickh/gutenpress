import { Resource } from '@gutenpress/core'
import { fromEntries } from '@gutenpress/helpers'
import { pathToRegex } from './path-to-regex'
import { MethodGroup } from '@gutenpress/core/dist/types'

export const findPathInResource = <R extends Resource<any, any>>(
  resource: R,
  path: string,
):
  | [
      MethodGroup<R extends Resource<any, infer Context> ? Context : never>,
      Record<string, string>,
    ]
  | undefined => {
  const [baseUrl] = path.split('?')
  const possiblePaths = Object.keys(resource).map(
    path => [path, pathToRegex(path)] as [string, RegExp],
  )
  const [matchingPath, matchingRegex] =
    possiblePaths.find(([, regex]) => regex.test(baseUrl)) || []

  if (matchingPath === undefined || matchingRegex === undefined) {
    return undefined
  }

  const queryValues = (baseUrl.match(matchingRegex) || []).slice(1)
  const queryNames = matchingPath
    .split('/')
    .filter(token => token.startsWith(':'))
    .map(token => token.slice(1))

  const queryEntries = queryValues.map(
    (value, index) => [queryNames[index], value] as [string, string],
  )

  return [resource[matchingPath], fromEntries(queryEntries)]
}
