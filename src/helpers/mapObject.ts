import { fromEntries } from './fromEntries'

const entries = <Target>(target: Target) =>
  Object.entries(target) as [keyof Target, Target[keyof Target]][]

export const mapObject = <Source, Target>(
  callback: (
    value: [keyof Source, Source[keyof Source]],
  ) => [keyof Target, Target[keyof Target]],
  object: Source,
): Target => fromEntries(entries(object).map(callback))
