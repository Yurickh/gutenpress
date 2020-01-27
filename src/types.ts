type Maybe<T> = T | undefined | Error

export interface Action<DataResponse, Params = {}, Context = {}> {
  (params: Params, context: Context): Promise<Maybe<DataResponse>>
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
