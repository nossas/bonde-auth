export interface JWT {
  valid: boolean
  token?: string
  first_name?: string
}

export interface DecodedToken {
  id: number
  expired_at: number
  iat: number
}

export interface Register {
  email: string
  code: string
  isNewUser: boolean
}