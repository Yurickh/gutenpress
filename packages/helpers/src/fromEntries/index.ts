export const fromEntries = <Target>(
  entries: [keyof Target, Target[keyof Target]][],
): Target =>
  entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value,
    }),
    {} as Target,
  )
