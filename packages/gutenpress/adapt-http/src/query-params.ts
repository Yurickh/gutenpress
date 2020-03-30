export const fromEntries = <Target>(
  entries: [keyof Target, Target[keyof Target]][],
): Target =>
  entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {} as Target,
  )

export const extractQueryParams = (path: string) => {
  const [, queryString] = path.split('?')

  if (queryString === undefined) return {}

  const entries = queryString.split('&').map(token => token.split('=')) as [
    string,
    string,
  ][]

  return fromEntries<{ [k: string]: string }>(entries)
}
