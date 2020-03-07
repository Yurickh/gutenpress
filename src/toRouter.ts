import * as http from 'http'
import { spreadResources } from './helpers/spreadResources'
import { Resource } from './types'
import { ClientError, ServerError } from './errors'

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

const defaultInitialContextBuilder: InitialContextBuilder<{}> = (
  _req: http.IncomingMessage,
  _res: http.ServerResponse,
) => ({})

export const toRouter = <
  InitialContext = {},
  Resources extends Resource<any, InitialContext>[] = []
>(
  resources: Resources,
  initialContextBuilder = defaultInitialContextBuilder as InitialContextBuilder<
    InitialContext
  >,
) => {
  const resource = spreadResources<InitialContext, Resources>(resources)

  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const selectedResource = resource[req.url]

    if (selectedResource === undefined) {
      return resolve(res, 404, { error: `Path [${req.url}] doesn't exist` })
    }

    const selectedHandler = selectedResource[req.method]

    if (selectedHandler === undefined) {
      return resolve(res, 405, {
        error: `Method [${req.method}] not allowed over ${req.url}`,
      })
    }

    let bodyBuffer = ''

    req.on('data', data => (bodyBuffer += data))

    req.on('end', () => {
      let body: object
      let handlerResponse: unknown

      try {
        if (bodyBuffer !== '') {
          body = JSON.parse(bodyBuffer)
        }
      } catch (error) {
        return resolve(res, 400, {
          error: `Cannot parse request body: ${error}`,
        })
      }

      try {
        handlerResponse = selectedHandler({
          body,
          context: initialContextBuilder(req, res),
          headers: req.headers,
        })
      } catch (error) {
        // TODO: add a logger
        console.error(error)
        return resolve(res, 500, { error: 'Internal error' })
      }

      Promise.resolve(handlerResponse)
        .then(response => {
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
        })
        .catch(error => {
          // TODO: add a logger
          console.error(error)
          return resolve(res, 500, { error: 'Internal error' })
        })
    })
  }
}
