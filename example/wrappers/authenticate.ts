import { UnauthorizedError } from 'gutenpress'
import { authenticate as authenticateInDatabase } from '../database'

export type Token = {
  userId: string
}

export const authenticate = (
  _context: {},
  request: Request,
): Token | UnauthorizedError => {
  const [_bearer, token] = request.headers.get('authorization').split(' ')
  const [username, password] = atob(token).split(':')

  if (authenticateInDatabase(username, password)) {
    return {
      userId: username,
    }
  } else {
    return new UnauthorizedError('Invalid token')
  }
}
