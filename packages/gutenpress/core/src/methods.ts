import { HTTPMethod, Action } from './types'

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
  } as {
    [p in Path]: { [m in Method]: Handler }
  })

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
