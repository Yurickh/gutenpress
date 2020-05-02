import { mapObject } from '@gutenpress/helpers'
import { Resource, HTTPMethod, RequestParams, MethodGroup } from './types'
import { combine } from './helpers/combine'

type NonErrorReturn<T> = T extends Error ? never : T
type ErrorReturn<T> = T extends Error ? T : never

type Wrapper<OutputContext, InputContext = {}> = (
  params: RequestParams<InputContext, HTTPMethod>,
) => OutputContext

type WrappedAction<
  OutputContext,
  InputContext,
  Method extends HTTPMethod,
  Action extends (
    params: RequestParams<NonErrorReturn<OutputContext>, any>,
  ) => any
> = (
  params: RequestParams<InputContext, Method>,
) =>
  | ErrorReturn<OutputContext>
  | (Action extends (
      params: RequestParams<NonErrorReturn<OutputContext>, Method>,
    ) => infer Result
      ? ErrorReturn<OutputContext> | Result
      : never)

const wrapAction = <
  OutputContext,
  InputContext,
  Action extends (
    params: RequestParams<NonErrorReturn<OutputContext>, any>,
  ) => any
>(
  action: Action,
  wrapper: Wrapper<OutputContext, InputContext>,
): WrappedAction<
  OutputContext,
  InputContext,
  Action extends (p: RequestParams<any, infer M>) => any ? M : never,
  Action
> => (params) => {
  const outputContext = wrapper(params) as
    | NonErrorReturn<OutputContext>
    | ErrorReturn<OutputContext>

  if (outputContext instanceof Error) {
    return outputContext
  }

  return action?.({
    ...params,
    context: outputContext as NonErrorReturn<OutputContext>,
  })
}

type WrapMethods<
  MG extends MethodGroup<OutputContext>,
  OutputContext,
  InputContext
> = {
  [method in keyof MG]: method extends HTTPMethod
    ? MG[method] extends (p: RequestParams<any, any>) => infer Result
      ? (p: RequestParams<InputContext, method>) => Result
      : never
    : never
}

const wrapMethods = <
  OutputContext,
  InputContext,
  MG extends MethodGroup<NonErrorReturn<OutputContext>>
>(
  wrapper: Wrapper<OutputContext, InputContext>,
  single: MG,
): WrapMethods<MG, NonErrorReturn<OutputContext>, InputContext> =>
  mapObject(([method, action]) => {
    if (action === undefined) return [method, undefined]

    // NOTE: not proud of this `action as any` here.
    // It seems ts can't open `MG[keyof MG]` since it doesn't know
    // exactly what's the type of it, but that's precisely what we want :T
    // Feel free to open a PR if you know how to solve this.
    return [method, wrapAction(action as any, wrapper)]
  }, single) as WrapMethods<MG, NonErrorReturn<OutputContext>, InputContext>

type WrappedResource<
  OutputContext,
  InputContext,
  R extends Resource<string, NonErrorReturn<OutputContext>>
> = {
  [path in keyof R]: WrapMethods<
    R[path],
    NonErrorReturn<OutputContext>,
    InputContext
  >
}

const wrapResource = <OutputContext, InputContext>(
  wrapper: Wrapper<OutputContext, InputContext>,
): (<R extends Resource<string, NonErrorReturn<OutputContext>>>(
  resource: R,
) => WrappedResource<OutputContext, InputContext, R>) =>
  mapObject(([path, methods]) => [path, wrapMethods(wrapper, methods)]) as <
    R extends Resource<string, NonErrorReturn<OutputContext>>
  >(
    resource: R,
  ) => WrappedResource<OutputContext, InputContext, R>

export const wrap = <
  Resources extends Resource<any, NonErrorReturn<OutputContext>>[],
  OutputContext,
  InputContext = {}
>(
  wrapper: Wrapper<OutputContext, InputContext>,
  resources: Resources,
) => wrapResource(wrapper)(combine(resources))
