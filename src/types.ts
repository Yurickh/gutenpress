export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type KeysOf<T> = T extends any ? keyof T : never

export interface RequestParams<Context> {
  readonly query?: object
  readonly body?: object
  readonly context?: Context
}

interface GetParams<Context> {
  readonly query?: object
  readonly context?: Context
  readonly body?: undefined
}

export type RequestParamsForMethod<
  Method extends HTTPMethod,
  Context = object
> = Method extends 'GET' ? GetParams<Context> : RequestParams<Context>

export type Resource<Path extends string, Context = object> = {
  [path in Path]: {
    [method in HTTPMethod]?: (
      params: RequestParamsForMethod<method, Context>,
      request: Request,
    ) => Error | undefined | unknown
  }
}
