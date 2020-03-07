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
  res.end(response && JSON.stringify(response))
}

const createHeaderProxy = (req: http.ClientRequest) => {
  return new Proxy(
    {},
    {
      get: (_, prop) => {
        return req.getHeader(prop.toString())
      },
    },
  )
}

export const toRouter = <Resources extends Resource<any, {}>[]>(
  resources: Resources,
) => {
  const resource = spreadResources(resources)

  return (req: http.ClientRequest, res: http.ServerResponse) => {
    res.setHeader('Content-Type', 'application/json')

    const selectedResource = resource[req.path]

    if (selectedResource === undefined) {
      return resolve(res, 404, { error: `Path [${req.path}] doesn't exist` })
    }

    const selectedHandler = selectedResource[req.method]

    if (selectedHandler === undefined) {
      return resolve(res, 405, {
        error: `Method [${req.method}] not allowed over ${req.path}`,
      })
    }

    let bodyBuffer = ''

    req.on('data', data => (bodyBuffer += data))

    req.on('end', () => {
      let body
      let handlerResponse

      try {
        body = JSON.stringify(bodyBuffer)
      } catch (error) {
        return resolve(res, 400, {
          error: `Cannot parse request body: ${error}`,
        })
      }

      try {
        handlerResponse = selectedHandler({
          body,
          context: {},
          headers: createHeaderProxy(req),
        })
      } catch (error) {
        return resolve(res, 500, { error: error.message })
      }

      Promise.resolve(handlerResponse).then(response => {
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
    })
  }
}
