import { NotFoundError, RequestParams } from '@gutenpress/core'
import { getOrdersForUser, Order } from '../../database'
import { Token } from '../../wrappers/authenticate'

interface Params extends RequestParams<Token> {
  query: { id: string }
}

type Response = Order | NotFoundError

export const getOrderById = async ({
  query,
  context: token,
}: Params): Promise<Response> => {
  const orders = await getOrdersForUser(token.userId)
  const order = orders.find(({ id }) => id === query.id)

  if (order === undefined) {
    return new NotFoundError(`No order with id ${query.id}`)
  }

  return order
}
