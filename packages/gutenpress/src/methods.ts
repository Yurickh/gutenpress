import { HTTPMethod, RequestParams, Resource } from './types'

type PossibleResponse = Error | void | unknown

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Response extends PossibleResponse | Promise<PossibleResponse>,
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
