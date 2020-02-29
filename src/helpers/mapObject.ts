import { fromEntries } from './fromEntries'

type ValueOf<T, K extends keyof T = keyof T> = T extends { [k in K]: infer V }
  ? V
  : never

type Entry<T> = [keyof T, ValueOf<T>]

const entries = <Target>(target: Target) =>
  Object.entries(target) as Entry<Target>[]

export const mapObject = <SK extends string, SV, TK extends string, TV>(
  callback: (value: [SK, SV]) => [TK, TV],
  object: { [sourceKey in SK]?: SV },
): { [targetKey in TK]: TV } => fromEntries(entries(object).map(callback))
