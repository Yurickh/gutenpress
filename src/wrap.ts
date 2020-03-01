import {
  Resource,
  KeysOf,
  RequestParamsForMethod,
  HTTPMethod,
  Action,
} from './types'
import { spreadResources } from './helpers/spreadResources'
import { mapObject } from './helpers/mapObject'

type Wrapper<OutputContext, InputContext = object> = (
  params: RequestParamsForMethod<HTTPMethod, InputContext>,
) => OutputContext | Error

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
          (params: RequestParamsForMethod<typeof methodName, InputContext>) => {
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
  Resources extends Resource<any, OutputContext>[]
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
