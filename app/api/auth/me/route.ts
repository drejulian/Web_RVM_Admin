import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

interface JWTPayload {
  adminId: string
  email: string
  role: string
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Tidak ada token' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token) as JWTPayload | null

    if (!payload) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    // Get admin data
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        email: true,
        nama: true,
        role: true,
        isActive: true,
        lastLogin: true,
      },
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Admin tidak ditemukan atau tidak aktif' },
        { status: 401 }
      )
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
