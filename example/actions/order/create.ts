import { InternalServerError, RequestParams } from 'gutenpress'
import { Order, createOrderForUser } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

interface Params extends RequestParams<Token> {
  body: Omit<Order, 'id'>
}

type Response = Order | InternalServerError

export const createOrder = async ({
  body: order,
  context: token,
}: Params): Promise<Response> => {
  const createdOrder = await createOrderForUser(token.userId, order)

  if (createdOrder === undefined) {
    return new InternalServerError('Something went wrong')
  }

  return createdOrder
}
