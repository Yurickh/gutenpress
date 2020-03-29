import { HTTPMethod } from '@gutenpress/core'

export type Definition = {
  [resource: string]: [string, HTTPMethod][]
}

export type MappersmithResource = {
  [resourceName: string]: {
    [methodName: string]: { method: HTTPMethod; path: string }
  }
}
