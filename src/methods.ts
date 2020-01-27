import { Action, HTTPMethod, RequestParams } from './types'

type ParamsFor<Method> = Method extends 'GET'
  ? Omit<RequestParams, 'body'>
  : RequestParams

const actionHandler = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  DataResponse,
  Params extends ParamsFor<Method>
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
