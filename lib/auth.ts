import { SignJWT, jwtVerify } from 'jose'

const JWT_EXPIRY = '30d'
const COOKIE_NAME = 'auth_token'

function getSecret() {
  let secret = process.env.JWT_SECRET ?? ''
  secret = secret.replace(/^['"]|['"]$/g, '')
  if (!secret) throw new Error('JWT_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

export async function createToken(): Promise<string> {
  return new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export { COOKIE_NAME }
