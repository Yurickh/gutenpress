import { HTTPMethod, RequestParamsForMethod } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Response extends Promise<{} | undefined | Error>,
  Context,
  Params extends RequestParamsForMethod<Method, Context>
>(
  path: Path,
  action: (params: Params, request: Request) => Response,
) =>
  ({
    [path]: {
      [method]: action,
    },
  } as { [p in Path]: { [m in Method]: typeof action } })

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
