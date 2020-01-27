import { Action, HTTPMethod, API } from './types'

const actionHandler = (method: HTTPMethod) => (
  path: string,
  action: Action,
): API => ({
  [path]: {
    [method]: action,
  },
})

export const get = actionHandler('GET')
export const post = actionHandler('POST')
export const put = actionHandler('PUT')
