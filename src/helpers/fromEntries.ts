export const fromEntries = <Key extends string, Value>(
  entries: [Key, Value][],
): Record<Key, Value> =>
  entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {} as Record<Key, Value>,
  )
