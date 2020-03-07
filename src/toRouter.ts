import * as http from 'http'
import { spreadResources } from './helpers/spreadResources'
import { Resource } from './types'
import { ClientError, ServerError } from './errors'

const resolve = (
  res: http.ServerResponse,
  statusCode: number,
  response?: object,
) => {
  res.statusCode = statusCode

  if (response !== undefined) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
  } else {
    res.end()
  }
}

export const toRouter = <Resources extends Resource<any, {}>[]>(
  resources: Resources,
) => {
  const resource = spreadResources(resources)

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
      let body
      let handlerResponse

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
          context: {},
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
