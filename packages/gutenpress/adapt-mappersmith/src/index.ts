import { Resource, combine } from '@gutenpress/core'
import { resourceToDefinition } from './resource-to-definition'
import { definitionToMappersmith } from './definition-to-mappersmith'

// WIP
export const toClientDefinition = (resources: Resource<any, any>[]) =>
  definitionToMappersmith(resourceToDefinition(combine(resources)))
