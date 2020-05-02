import { HTTPMethod, Action, SingleResource } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Handler extends Action<Method, any>
>(
  path: Path,
  action: Handler,
) =>
  ({
    [path]: {
      [method]: action,
    },
  } as SingleResource<
    Path,
    Method,
    Handler extends Action<Method, infer Context> ? Context : never,
    Handler
  >)

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
