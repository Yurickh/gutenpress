import { API } from './types'
import { fromEntries } from './helpers/fromEntries'

const prefixAPI = (prefix: string) => (api: API): API =>
  fromEntries(
    Object.entries(api).map(([path, action]) => [`${prefix}${path}`, action]),
  )

const mergeAPIs = (apis: API[]): API =>
  apis.reduce((acc, curr) => {
    const allPaths = new Set([...Object.keys(acc), ...Object.keys(curr)])

    return fromEntries(
      Array.from(allPaths).map(path => [
        path,
        {
          ...acc[path],
          ...curr[path],
        },
      ]),
    )
  }, {} as API)

export const path = (prefix: string, apis: API[]): API =>
  mergeAPIs(apis.map(prefixAPI(prefix)))
