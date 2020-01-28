import { get } from 'gutenpress'
import { Token } from 'example/wrappers/authenticate'
import { getUser, User } from 'example/database'

type Params = {
  context: Token
}

type Response = Pick<User, 'name' | 'phoneNumber'>

const getContactDetails = async ({
  context: token,
}: Params): Promise<Response> => {
  const user = await getUser(token.userId)

  return {
    name: user.name,
    phoneNumber: user.phoneNumber,
  }
}

export const contactDetails = get('/contact-details', getContactDetails)
