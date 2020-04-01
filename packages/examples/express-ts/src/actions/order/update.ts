import { NotFoundError, RequestParams } from '@gutenpress/core'
import { Order, updateOrderForUser } from '../../database'
import { Token } from '../../wrappers/authenticate'

interface Params extends RequestParams<Token> {
  path: { id: string }
  body: Partial<Order>
}

type Response = undefined | NotFoundError

export const updateOrderById = async ({
  body: order,
  context: token,
  path,
}: Params): Promise<Response> => {
  if (!(await updateOrderForUser(token.userId, path.id, order))) {
    return new NotFoundError(`Could not found order with id ${path.id}`)
  }

  return undefined
}
