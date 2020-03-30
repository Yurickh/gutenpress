import * as http from 'http'
import { Resource } from '@gutenpress/core'
import { AdaptHTTPConfig, InitialContextBuilder, EmptyObject } from './types'
import { transformResourcesIntoRouter } from './transform-resources-into-router'

const defaultInitialContextBuilder: InitialContextBuilder<EmptyObject> = (
  _req: http.IncomingMessage,
  _res: http.ServerResponse,
) => ({})

const defaultConfig = {
  initialContextBuilder: defaultInitialContextBuilder,
}

export const toRouterWithConfig = <Config extends AdaptHTTPConfig<any>>(
  config: Config,
) => (
  resources: Resource<
    any,
    Config extends AdaptHTTPConfig<infer Context> ? Context : never
  >[],
) => transformResourcesIntoRouter(resources, config.initialContextBuilder)

export const toRouter = toRouterWithConfig(defaultConfig)
