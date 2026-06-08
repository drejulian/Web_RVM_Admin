import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-super-aman-123'
const secret = new TextEncoder().encode(JWT_SECRET)

export async function signToken(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  
  return jwt
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}
