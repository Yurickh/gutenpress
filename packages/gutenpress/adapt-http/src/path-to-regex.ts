export const pathToRegex = (path: string) => {
  const regexLikePath = path
    .split('/')
    // Transforms /a/:id/b into /a/(\w+)/b
    .map((token) => (token.startsWith(':') ? `(\\w+)` : token))
    .join('/')

  return new RegExp(`^${regexLikePath}`)
}
