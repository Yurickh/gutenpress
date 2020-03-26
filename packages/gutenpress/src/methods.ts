import { HTTPMethod, RequestParams, Resource } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Response extends Promise<{} | undefined | Error>,
  Context
>(
  path: Path,
  action: (params: RequestParams<Context, Method>) => Response,
) =>
  ({
    [path]: {
      [method]: action,
    },
  } as Resource<Path, Context>)

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
