import { HTTPMethod, RequestParamsForMethod, Action } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Response extends Promise<{} | undefined | Error>,
  Context,
  Params extends RequestParamsForMethod<Method, Context>
>(
  path: Path,
  action: (params: Params) => Response,
) =>
  ({
    [path]: {
      [method]: action,
    },
  } as { [p in Path]: { [m in Method]: Action<m, Context> } })

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
