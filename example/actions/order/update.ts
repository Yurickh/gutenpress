import { NotFoundError, RequestParams } from 'gutenpress'
import { Order, updateOrderForUser } from 'example/database'
import { Token } from 'example/wrappers/authenticate'

interface Params extends RequestParams {
  query: { id: string }
  body: Partial<Order>
  context: Token
}

type Response = undefined | NotFoundError

export const updateOrderById = async ({
  body: order,
  context: token,
  query,
}: Params): Promise<Response> => {
  if (!(await updateOrderForUser(token.userId, query.id, order))) {
    return new NotFoundError(`Could not found order with id ${query.id}`)
  }
}
