export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type KeysOf<T> = T extends any ? keyof T : never

export interface RequestParams<
  Context = {},
  Method extends HTTPMethod = HTTPMethod
> {
  // COMBAK: find a way to enforce values in the query and path objects are strings
  readonly query: any
  readonly path: any
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

export type SingleResource<
  Path extends string,
  Method extends HTTPMethod,
  Context,
  Handler extends Action<Method, Context>
> = {
  [p in Path]: { [m in Method]: Handler }
}
