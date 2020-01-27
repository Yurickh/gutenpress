type Maybe<T> = T | undefined | Error

export type RequestParams = {
  query?: object
  body?: object
  context?: object
}

export interface Action<DataResponse, Params extends RequestParams = {}> {
  (params: Params): Promise<Maybe<DataResponse>>
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
