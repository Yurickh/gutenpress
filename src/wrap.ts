import { Resource, KeysOf, HTTPMethod, Action, RequestParams } from './types'
import { spreadResources } from './helpers/spreadResources'
import { mapObject } from './helpers/mapObject'

type NonErrorReturn<T> = T extends Error ? never : T

type Wrapper<OutputContext, InputContext = object> = (
  params: RequestParams<InputContext, HTTPMethod>,
) => OutputContext

const applyWrapper = <InputContext, OutputContext>(
  wrapper: Wrapper<OutputContext, InputContext>,
) => <Path extends string>(
  resource: Resource<Path, OutputContext>,
): Resource<Path, InputContext> =>
  mapObject(
    ([path, methods]) => [
      path,
      mapObject(
        ([methodName, action]) => [
          methodName,
          (params: RequestParams<InputContext, typeof methodName>) => {
            const outputContext = wrapper(params)

            if (outputContext instanceof Error) {
              return outputContext
            }

            return (action as Action<typeof methodName, OutputContext>)({
              ...params,
              context: outputContext,
            })
          },
        ],
        methods,
      ),
    ],
    resource,
  )

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
  const mappedResources = resources.map(applyWrapper(wrapper))

  return spreadResources(mappedResources)
}
