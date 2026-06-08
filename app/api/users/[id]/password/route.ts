import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// PUT - Update user password
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Parse request body
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah',
      email: updatedUser.email,
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah password' },
      { status: 500 }
    )
  }
}
