import * as http from 'http'
import {
  combine,
  Resource,
  RequestParams,
  ClientError,
  ServerError,
  HTTPMethod,
} from '@gutenpress/core'

const resolve = (
  res: http.ServerResponse,
  statusCode: number,
  response?: unknown,
) => {
  res.statusCode = statusCode

  if (response !== undefined) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
  } else {
    res.end()
  }
}

type InitialContextBuilder<InitialContext> = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => InitialContext

type EmptyObject = { [key: string]: never }

const defaultInitialContextBuilder: InitialContextBuilder<EmptyObject> = (
  _req: http.IncomingMessage,
  _res: http.ServerResponse,
) => ({})

const transformResourcesIntoRouter = <InitialContext = EmptyObject>(
  resources: Resource<any, ReturnType<InitialContextBuilder<InitialContext>>>[],
  initialContextBuilder: InitialContextBuilder<InitialContext>,
) => {
  const resource = combine<InitialContext, typeof resources>(resources)

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.url === undefined) {
      return resolve(res, 404, { error: `Request has empty url` })
    }

    if (req.method === undefined) {
      return resolve(res, 405, { error: `Request has invalid method` })
    }

    const selectedResource = resource[req.url as keyof typeof resource]

    if (selectedResource === undefined) {
      return resolve(res, 404, { error: `Path [${req.url}] doesn't exist` })
    }

    const selectedHandler = selectedResource[req.method as HTTPMethod]

    if (selectedHandler === undefined) {
      return resolve(res, 405, {
        error: `Method [${req.method}] not allowed over ${req.url}`,
      })
    }

    let bodyBuffer = ''

    req.on('data', data => (bodyBuffer += data))

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
          query: {},
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

interface AdaptHTTPConfig<InitialContext> {
  initialContextBuilder: InitialContextBuilder<InitialContext>
}

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