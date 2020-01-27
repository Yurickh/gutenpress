import { Action, NotFoundError } from 'gutenpress'
import { Order, updateOrderForUser } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

export const updateOrderById: Action<
  undefined,
  { body: Partial<Order>; query: { id: string }; context: Token }
> = async ({ body: order, context: token, query }) => {
  if (!(await updateOrderForUser(token.userId, query.id, order))) {
    return new NotFoundError(`Could not found order with id ${query.id}`)
  }
}
