import { fromEntries } from '../fromEntries'

const entries = <Target>(target: Target) =>
  Object.entries(target) as [keyof Target, Target[keyof Target]][]

type Callback<Source, Target> = (
  value: [keyof Source, Source[keyof Source]],
) => [keyof Target, Target[keyof Target]]

const uncurriedMapObject = <Source, Target>(
  callback: Callback<Source, Target>,
  object: Source,
): Target => fromEntries(entries(object).map(callback))

export function mapObject<Source, Target>(
  callback: Callback<Source, Target>,
): (source: Source) => Target
export function mapObject<Source, Target>(
  callback: Callback<Source, Target>,
  object: Source,
): Target

export function mapObject<Source, Target>(
  callback: Callback<Source, Target>,
  object?: Source,
): Target | ((source: Source) => Target) {
  if (object === undefined) {
    return object => uncurriedMapObject(callback, object)
  } else {
    return uncurriedMapObject(callback, object)
  }
}
