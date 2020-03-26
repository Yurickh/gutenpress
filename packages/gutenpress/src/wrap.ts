import {
  Resource,
  KeysOf,
  HTTPMethod,
  RequestParams,
  MethodGroup,
} from './types'
import { combine } from './helpers/combine'
import { mapObject } from './helpers/mapObject'

type NonErrorReturn<T> = T extends Error ? never : T

type Wrapper<OutputContext, InputContext = object> = (
  params: RequestParams<InputContext, HTTPMethod>,
) => OutputContext

const wrapMethods = <InputContext, OutputContext>(
  wrapper: Wrapper<OutputContext, InputContext>,
  single: MethodGroup<NonErrorReturn<OutputContext>>,
): MethodGroup<InputContext> =>
  mapObject(
    ([methodName, action]) => [
      methodName,
      (params: RequestParams<InputContext, typeof methodName>) => {
        const outputContext = wrapper(params)

        if (outputContext instanceof Error) {
          return outputContext
        }

        if (action === undefined) {
          return undefined
        }

        return action({
          ...params,
          context: outputContext as NonErrorReturn<OutputContext>,
        })
      },
    ],
    single,
  )

const wrapResource = <InputContext, OutputContext>(
  wrapper: Wrapper<OutputContext, InputContext>,
): (<Path extends string>(
  resource: Resource<Path, NonErrorReturn<OutputContext>>,
) => Resource<Path, InputContext>) =>
  mapObject(([path, methods]) => [path, wrapMethods(wrapper, methods)])

export const wrap = <
  InputContext,
  OutputContext,
  Resources extends Resource<any, NonErrorReturn<OutputContext>>[]
>(
  wrapper: Wrapper<OutputContext, InputContext>,
  resources: Resources,
): Resource<
  Resources extends (infer R)[] ? KeysOf<R> : never,
  InputContext
> => {
  const mappedResources = resources.map(wrapResource(wrapper))

  return combine(mappedResources)
}
