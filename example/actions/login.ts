import { Action, UnauthorizedError } from 'gutenpress'
import { authenticate } from 'example/database'

export const login: Action<
  string,
  { body: { username: string; password: string } }
> = async ({ body }) => {
  const { username, password } = body
  const canLogIn = await authenticate(username, password)

  if (canLogIn) {
    return btoa(`${username}:${password}`)
  } else {
    return new UnauthorizedError('Wrong username or password')
  }
}
