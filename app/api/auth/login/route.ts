import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import { signToken } from '@/lib/jwt'

interface LoginBody {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginBody = await request.json()
    console.log('Login attempt for:', email)

    // Validasi input
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Cari admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      console.log('Admin not found')
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }
    
    console.log('Admin found:', admin.email)

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Akun Anda telah dinonaktifkan' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      console.log('Invalid password')
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })
    console.log('Last login updated')

    // Generate JWT token
    const token = await signToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    })
    console.log('Token generated:', token.substring(0, 20) + '...')

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
        role: admin.role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    console.log('Cookie set, returning response')
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
