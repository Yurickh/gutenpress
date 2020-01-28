import { NotFoundError, RequestParams } from 'gutenpress'
import { getOrdersForUser, Order } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

interface Params extends RequestParams {
  query: { id: string }
  context: Token
  body: { potato: string }
}

type Response = Order | NotFoundError

export const getOrderById = async ({
  query,
  // Here for testing warnings on body with get requests
  body,
  context: token,
}: Params): Promise<Response> => {
  console.log(body)
  const orders = await getOrdersForUser(token.userId)
  const order = orders.find(({ id }) => id === query.id)

  if (order === undefined) {
    return new NotFoundError(`No order with id ${query.id}`)
  }

  return order
}
