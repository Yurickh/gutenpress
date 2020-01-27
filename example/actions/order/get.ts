import { NotFoundError, Action } from 'gutenpress'
import { getOrdersForUser, Order } from 'example/database'

export const getOrderById: Action<
  Order,
  { userId: string },
  { id: string }
> = async ({ userId }, { id: orderId }) => {
  const orders = await getOrdersForUser(userId)
  const order = orders.find(({ id }) => id === orderId)

  if (order === undefined) {
    return new NotFoundError(`No order with id ${orderId}`)
  }

  return order
}
