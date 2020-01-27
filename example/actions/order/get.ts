import { NotFoundError, Action } from 'gutenpress'
import { getOrdersForUser, Order } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

export const getOrderById: Action<
  Order,
  { query: { id: string }; context: Token }
> = async ({ query, context: token }) => {
  const orders = await getOrdersForUser(token.userId)
  const order = orders.find(({ id }) => id === query.id)

  if (order === undefined) {
    return new NotFoundError(`No order with id ${query.id}`)
  }

  return order
}
