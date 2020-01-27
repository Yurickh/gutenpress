import { Action, HTTPMethod } from './types'

const actionHandler = (method: HTTPMethod) => <
  Path extends string,
  DataResponse,
  Context,
  Params
>(
  path: Path,
  action: Action<DataResponse, Context, Params>,
) => ({
  [path]: {
    [method]: action,
  },
})

export const get = actionHandler('GET')
export const post = actionHandler('POST')
export const put = actionHandler('PUT')
