export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type KeysOf<T> = T extends any ? keyof T : never

export interface RequestParams<
  Context = {},
  Method extends HTTPMethod = HTTPMethod
> {
  readonly query: Record<string, string>
  readonly body: Method extends 'GET' ? void : any
  readonly context: Context
  readonly headers: Record<string, string>
}

type PossibleResponse = Error | void | unknown

export type Action<Method extends HTTPMethod, Context = object> = (
  params: RequestParams<Context, Method>,
) => PossibleResponse | Promise<PossibleResponse>

export type MethodGroup<Context> = {
  [method in HTTPMethod]?: Action<method, Context>
}

export type Resource<Path extends string, Context = object> = {
  [path in Path]: MethodGroup<Context>
}
