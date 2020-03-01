export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type KeysOf<T> = T extends any ? keyof T : never

type Headers = {
  [headerName: string]: string
}

export interface RequestParams<Context = {}> {
  readonly query?: object
  readonly body?: object
  readonly context: Context
  readonly headers?: Headers
}

export interface GetParams<Context> {
  readonly query?: object
  readonly body?: undefined
  readonly context: Context
  readonly headers?: Headers
}

export type RequestParamsForMethod<
  Method extends HTTPMethod,
  Context = object
> = Method extends 'GET' ? GetParams<Context> : RequestParams<Context>

export type Action<Method extends HTTPMethod, Context = object> = (
  params: RequestParamsForMethod<Method, Context>,
) => Error | undefined | unknown

export type Resource<Path extends string, Context = object> = {
  [path in Path]: {
    [method in HTTPMethod]?: Action<method, Context>
  }
}
