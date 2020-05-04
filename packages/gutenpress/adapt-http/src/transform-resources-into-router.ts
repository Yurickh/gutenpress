import * as http from 'http'
import {
  combine,
  Resource,
  RequestParams,
  ClientError,
  ServerError,
  HTTPMethod,
} from '@gutenpress/core'
import { InitialContextBuilder, EmptyObject } from './types'
import { resolve } from './resolve'
import { extractQueryParams } from './query-params'
import { findPathInResource } from './find-path-in-resource'

export const transformResourcesIntoRouter = <InitialContext = EmptyObject>(
  resources: Resource<any, ReturnType<InitialContextBuilder<InitialContext>>>[],
  initialContextBuilder: InitialContextBuilder<InitialContext>,
) => {
  const resource = combine(resources)

  return (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next?: () => void,
  ) => {
    const { url, method } = req

    if (url === undefined) {
      return resolve(res, 404, { error: `Request has empty url` })
    }

    if (method === undefined) {
      return resolve(res, 405, { error: `Request has invalid method` })
    }

    const [selectedResource, pathParams] = findPathInResource(resource, url)

    if (selectedResource === undefined) {
      if (next !== undefined) {
        next()
        return
      }

      return resolve(res, 404, { error: `Path [${url}] doesn't exist` })
    }

    const selectedHandler = selectedResource[method as HTTPMethod]

    if (selectedHandler === undefined) {
      return resolve(res, 405, {
        error: `Method [${method}] not allowed over ${url}`,
      })
    }

    let bodyBuffer = ''

    req.on('data', (data) => (bodyBuffer += data))

    req.on('end', async () => {
      let body: object | undefined

      try {
        if (bodyBuffer !== '') {
          body = JSON.parse(bodyBuffer)
        } else {
          body = undefined
        }
      } catch (error) {
        return resolve(res, 400, {
          error: `Cannot parse request body: ${error}`,
        })
      }

      try {
        const response = await selectedHandler({
          body,
          path: pathParams,
          query: extractQueryParams(url),
          context: initialContextBuilder(req, res),
          headers: req.headers,
        } as RequestParams<InitialContext>)

        if (
          response instanceof ClientError
          || response instanceof ServerError
        ) {
          return resolve(res, response.statusCode, {
            error: response.message,
          })
        }

        if (response === undefined) {
          return resolve(res, 204)
        } else {
          return resolve(res, 200, response)
        }
      } catch (error) {
        // TODO: add a logger
        console.error(error)
        return resolve(res, 500, { error: 'Internal error' })
      }
    })
  }
}
