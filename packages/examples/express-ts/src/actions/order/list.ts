import { RequestParams } from '@gutenpress/core'
import { Token } from 'wrappers/authenticate'
import { getOrdersForUser } from '../../database'

export const listOrders = ({ context: token }: RequestParams<Token>) => {
  return getOrdersForUser(token.userId)
}
