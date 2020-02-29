import { Resource, KeysOf } from './types'
import { spreadResources } from './helpers/spreadResources'
import { mapObject } from './helpers/mapObject'

type Wrapper<OutputContext, InputContext = {}> = (
  context: InputContext,
  request: Request,
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
          (params: { context: InputContext }, request: Request) => {
            const outputContext = wrapper(params.context, request)

            if (outputContext instanceof Error) {
              return outputContext
            }

            return action({ ...params, context: outputContext }, request)
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