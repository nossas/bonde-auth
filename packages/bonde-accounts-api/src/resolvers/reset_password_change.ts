import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT } from '../types'
import * as UsersAPI from '../graphql/users'
import { reset_password_verify } from './'

export default async (root, args): Promise<JWT> => {
  const { token, password } = args
  const decoded = await reset_password_verify(null, { token })

  const encrypted_password = await bcrypt.hash(password, 9)

  const user = await UsersAPI.update(decoded.id, { encrypted_password, reset_password_token: '' })

  if (!user) throw new Error('user_not_found')

  const payload = {
    sub: 'postgraphql',
    role: user.admin ? 'admin' : 'common_user',
    user_id: user.id
  }
  const options = { audience: 'postgraphile' }

  return { valid: true, token: jwt.sign(payload, process.env.JWT_SECRET, options), first_name: user.first_name }
}