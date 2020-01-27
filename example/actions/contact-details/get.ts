import { Action } from 'gutenpress'
import { Token } from 'example/wrappers/authenticate'
import { getUser } from 'example/database'

export const getContactDetails: Action<
  { name: string; phoneNumber: string },
  { context: Token }
> = async ({ context: token }) => {
  const user = await getUser(token.userId)

  return {
    name: user.name,
    phoneNumber: user.phoneNumber,
  }
}
