import { HTTPMethod, RequestParamsForMethod } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Response extends Promise<{} | undefined | Error>,
  Params extends RequestParamsForMethod<Method>
>(
  path: Path,
  action: (params: Params) => Response,
) => ({
  [path]: {
    [method]: action,
  },
})

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
