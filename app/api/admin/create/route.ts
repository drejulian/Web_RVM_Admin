import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { AdminRole } from '@prisma/client'

interface CreateAdminBody {
  email: string
  password: string
  nama: string
  role?: AdminRole
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, nama, role }: CreateAdminBody = await request.json()

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        nama,
        password: hashedPassword,
        role: role || AdminRole.OPERATOR,
      },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    )
  }
}
