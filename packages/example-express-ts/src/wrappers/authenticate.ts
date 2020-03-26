import { UnauthorizedError, RequestParams } from 'gutenpress'
import { authenticate as authenticateInDatabase } from '../database'

export type Token = {
  userId: string
}

export const authenticate = ({
  headers,
}: RequestParams): Token | UnauthorizedError => {
  const [, token] = headers?.authorization.split(' ') || []
  const [username, password] = Buffer.from(token, 'base64')
    .toString()
    .split(':')

  if (authenticateInDatabase(username, password)) {
    return {
      userId: username,
    }
  } else {
    return new UnauthorizedError('Invalid token')
  }
}
