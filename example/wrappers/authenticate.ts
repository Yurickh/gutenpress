import { UnauthorizedError, RequestParams } from 'gutenpress'
import { authenticate as authenticateInDatabase } from '../database'

export type Token = {
  userId: string
}

export const authenticate = ({
  headers,
}: RequestParams): Token | UnauthorizedError => {
  const [_bearer, token] = headers.authorization.split(' ')
  const [username, password] = atob(token).split(':')

  if (authenticateInDatabase(username, password)) {
    return {
      userId: username,
    }
  } else {
    return new UnauthorizedError('Invalid token')
  }
}
