import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.bottleTransaction.findMany({
      include: {
        userBottleCount: {
          include: {
            user: {
              select: {
                nama: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100, // Limit to last 100 transactions
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
