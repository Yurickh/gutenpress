export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestParams {
  readonly query?: object
  readonly body?: object
  readonly context?: object
}

interface GetParams {
  readonly query?: object
  readonly context?: object
  readonly body?: undefined
}

export type RequestParamsForMethod<
  Method extends HTTPMethod
> = Method extends 'GET' ? GetParams : RequestParams
