import * as http from 'http'

export const resolve = (
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
