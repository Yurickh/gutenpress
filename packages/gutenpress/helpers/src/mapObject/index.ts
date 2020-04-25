import { fromEntries } from '../fromEntries'

type Entry<Obj> = [keyof Obj, Obj[keyof Obj]]

const entries = <Target>(target: Target) =>
  Object.entries(target) as Entry<Target>[]

type Callback<Source, TargetKey, TargetValue> = (
  pairs: Entry<Source>,
) => [TargetKey, TargetValue]

const uncurriedMapObject = <Source, TargetKey extends PropertyKey, TargetValue>(
  callback: Callback<Source, TargetKey, TargetValue>,
  object: Source,
) =>
  (fromEntries(entries(object).map(callback)) as unknown) as Record<
    TargetKey,
    TargetValue
  >

export function mapObject<Source, TargetKey extends PropertyKey, TargetValue>(
  callback: Callback<Source, TargetKey, TargetValue>,
): (source: Source) => { [k in TargetKey]: TargetValue }
export function mapObject<Source, TargetKey extends PropertyKey, TargetValue>(
  callback: Callback<Source, TargetKey, TargetValue>,
  object: Source,
): { [k in TargetKey]: TargetValue }

export function mapObject<Source, TargetKey extends PropertyKey, TargetValue>(
  callback: Callback<Source, TargetKey, TargetValue>,
  object?: Source,
):
  | { [k in TargetKey]: TargetValue }
  | ((source: Source) => { [k in TargetKey]: TargetValue }) {
  if (object === undefined) {
    return (object) => uncurriedMapObject(callback, object)
  } else {
    return uncurriedMapObject(callback, object)
  }
}
