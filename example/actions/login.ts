import { UnauthorizedError, RequestParams } from 'gutenpress'
import { authenticate } from 'example/database'

interface Params extends RequestParams {
  body: { username: string; password: string }
}

type Response = string | UnauthorizedError

export const login = async ({ body }: Params): Promise<Response> => {
  const { username, password } = body
  const canLogIn = await authenticate(username, password)

  if (canLogIn) {
    return btoa(`${username}:${password}`)
  } else {
    return new UnauthorizedError('Wrong username or password')
  }
}
