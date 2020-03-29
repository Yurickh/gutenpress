import { HTTPMethod } from '@gutenpress/core'
import { Definition, MappersmithResource } from './types'

// TODO: make this overridable
const nameMap = {
  GET: 'all',
  POST: 'create',
  PATCH: 'update',
  PUT: 'update',
  DELETE: 'remove',
} as const

const methodsToMappersmith = (methods: [string, HTTPMethod][]) =>
  methods.reduce(
    (acc, [path, method]) => ({
      ...acc,
      [nameMap[method]]: {
        path,
        method,
      },
    }),
    {},
  )

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

export const definitionToMappersmith = (
  definition: Definition,
): MappersmithResource =>
  fromEntries(
    Object.entries(definition).map(([resource, methods]) => [
      resource,
      methodsToMappersmith(methods),
    ]),
  )
