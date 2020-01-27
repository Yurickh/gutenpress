import { Action, HTTPMethod } from './types'

const actionHandler = (method: HTTPMethod) => <
  Path extends string,
  DataResponse,
  Params
>(
  path: Path,
  action: Action<DataResponse, Params>,
) => ({
  [path]: {
    [method]: action,
  },
})

export const get = actionHandler('GET')
export const post = actionHandler('POST')
export const put = actionHandler('PUT')
