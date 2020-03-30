import { Resource } from '@gutenpress/core'

export const findPathInResource = <R extends Resource<any, any>>(
  resource: R,
  path: string,
) => {
  const [baseUrl] = path.split('?')

  return resource[baseUrl]
}
