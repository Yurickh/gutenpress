import { NotFoundError, GetParams } from 'gutenpress'
import { getOrdersForUser, Order } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

interface Params extends GetParams<Token> {
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
