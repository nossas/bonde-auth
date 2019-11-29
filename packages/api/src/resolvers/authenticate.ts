import bcrypt from 'bcrypt'
import * as UsersAPI from '../graphql/users'
import { JWT } from '../types'
import { generateJWT } from '../utils'

export default async (root, args): Promise<JWT> => {
  const { email, password } = args
  const errorCode = 'email_password_dismatch'

  const user = (await UsersAPI.find({ email }))[0]

  if (!user) throw new Error(errorCode)

  if (await bcrypt.compare(password, user.encrypted_password)) {
    return { valid: true, token: generateJWT(user), first_name: user.first_name }
  }

  throw new Error(errorCode)
}