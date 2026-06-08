import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET single user with detailed info
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bottleCount: {
          include: {
            bottleTransactions: {
              orderBy: {
                timestamp: 'desc',
              },
              take: 10,
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// DELETE user (suspend/delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus user' },
      { status: 500 }
    )
  }
}
