import { HTTPMethod, Resource, Action } from './types'

const createHandlerForMethod = <Method extends HTTPMethod>(method: Method) => <
  Path extends string,
  Context
>(
  path: Path,
  action: Action<Method, Context>,
) =>
  ({
    [path]: {
      [method]: action,
    },
  } as Resource<Path, Context>)

export const get = createHandlerForMethod('GET')
export const post = createHandlerForMethod('POST')
export const put = createHandlerForMethod('PUT')
