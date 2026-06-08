import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get total users
    const totalUsers = await prisma.user.count()

    // Get total bottles from all user bottle counts
    const bottleStats = await prisma.userBottleCount.aggregate({
      _sum: {
        lifetimeCount: true,
        lifetimePoints: true,
      },
    })

    // Get total transactions
    const totalTransactions = await prisma.bottleTransaction.count()

    // Get active devices (connected in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const activeDevices = await prisma.arduinoConnection.count({
      where: {
        status: 'CONNECTED',
        lastPing: {
          gte: fiveMinutesAgo,
        },
      },
    })

    // Get active locations
    const activeLocations = await prisma.rvmLocation.count({
      where: {
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({
      totalUsers,
      totalBottles: bottleStats._sum.lifetimeCount || 0,
      totalTransactions,
      totalPoints: bottleStats._sum.lifetimePoints || 0,
      activeDevices,
      activeLocations,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
