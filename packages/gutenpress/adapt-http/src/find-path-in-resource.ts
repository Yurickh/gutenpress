import { Resource, MethodGroup } from '@gutenpress/core'
import { fromEntries } from '@gutenpress/helpers'
import { pathToRegex } from './path-to-regex'
import { ContextFrom } from './types'

type PathParams = Record<string, string>

export const findPathInResource = <R extends Resource<any, any>>(
  resource: R,
  path: string,
): [MethodGroup<ContextFrom<R>>, PathParams] | [] => {
  const [baseUrl] = path.split('?')
  const possiblePaths = Object.keys(resource).map(
    (path) => [path, pathToRegex(path)] as [string, RegExp],
  )
  const [matchingPath, matchingRegex] =
    possiblePaths.find(([, regex]) => regex.test(baseUrl)) || []

  if (matchingPath === undefined || matchingRegex === undefined) {
    return []
  }

  // We know something will match because we've tested it already, but ts doesn't know that
  // so we need to fallback to []
  const queryValues = (baseUrl.match(matchingRegex) || []).slice(1)
  const queryNames = matchingPath
    .split('/')
    .filter((token) => token.startsWith(':'))
    // Removes the leading colon
    .map((token) => token.slice(1))

  const queryEntries = queryValues.map(
    (value, index) => [queryNames[index], value] as [string, string],
  )

  return [resource[matchingPath], fromEntries(queryEntries)]
}
