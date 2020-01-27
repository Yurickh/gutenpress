import { Action, InternalServerError } from 'gutenpress'
import { Order, createOrderForUser } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

export const createOrder: Action<
  Order,
  { body: Order & { id: undefined }; context: Token }
> = async ({ body: order, context: token }) => {
  const createdOrder = await createOrderForUser(token.userId, order)

  if (createdOrder === undefined) {
    return new InternalServerError('Something went wrong')
  }

  return createdOrder
}
