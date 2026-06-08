import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const devices = await prisma.arduinoConnection.findMany({
      orderBy: {
        lastPing: 'desc',
      },
    })

    return NextResponse.json({ devices })
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}
