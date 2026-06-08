import { NextResponse } from 'next/server'
import { signToken, verifyToken } from '@/lib/jwt'

export async function GET() {
  try {
    // Test JWT
    const testPayload = {
      adminId: 'test-123',
      email: 'test@test.com',
      role: 'ADMIN',
    }

    console.log('Creating test token with payload:', testPayload)
    const token = await signToken(testPayload)
    console.log('Token created:', token)

    console.log('Verifying token...')
    const verified = await verifyToken(token)
    console.log('Verified payload:', verified)

    return NextResponse.json({
      success: true,
      originalPayload: testPayload,
      token: token,
      verifiedPayload: verified,
      match: JSON.stringify(testPayload) === JSON.stringify(verified),
    })
  } catch (error: any) {
    console.error('Test JWT error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
