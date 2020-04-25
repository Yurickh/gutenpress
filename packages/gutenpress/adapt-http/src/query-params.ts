import { fromEntries } from '@gutenpress/helpers'

export const extractQueryParams = (path: string) => {
  const [, queryString] = path.split('?')

  if (queryString === undefined) return {}

  const entries = queryString.split('&').map((token) => token.split('=')) as [
    string,
    string,
  ][]

  return fromEntries<{ [k: string]: string }>(entries)
}
