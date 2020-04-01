import { NotFoundError, RequestParams } from '@gutenpress/core'
import { getOrdersForUser, Order } from '../../database'
import { Token } from '../../wrappers/authenticate'

interface Params extends RequestParams<Token> {
  path: { id: string }
}

type Response = Order | NotFoundError

export const getOrderById = async ({
  path,
  context: token,
}: Params): Promise<Response> => {
  const orders = await getOrdersForUser(token.userId)
  const order = orders.find(({ id }) => id === path.id)

  if (order === undefined) {
    return new NotFoundError(`No order with id ${path.id}`)
  }

  return order
}
