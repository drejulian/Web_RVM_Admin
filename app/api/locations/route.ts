import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateLocationBody {
  name: string
  address?: string
  latitude?: number
  longitude?: number
  capacity?: number
  operationalHours?: string
  contactNumber?: string
  status?: string
  image?: string | null // This will now be a JSON string of Cloudinary URLs
}

export async function GET() {
  try {
    const locations = await prisma.rvmLocation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLocationBody = await request.json()
    const {
      name,
      address,
      latitude,
      longitude,
      capacity,
      operationalHours,
      contactNumber,
      status,
      image,
    } = body

    // Validasi input
    if (!name) {
      return NextResponse.json(
        { error: 'Nama lokasi harus diisi' },
        { status: 400 }
      )
    }

    // Create location
    const location = await prisma.rvmLocation.create({
      data: {
        name,
        address: address || null,
        position: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
        capacity: capacity ? parseInt(capacity.toString()) : 100,
        currentStock: 0,
        capacityStatus: 'AVAILABLE',
        operationalHours: operationalHours || '08:00-22:00',
        contactNumber: contactNumber || null,
        status: status || 'ACTIVE',
        image: image || null,
      },
    })

    // Auto-create ArduinoConnection with deviceId based on location name
    const cleanName = name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toUpperCase()
    
    const deviceId = `RVM-${cleanName}`

    const arduinoConnection = await prisma.arduinoConnection.create({
      data: {
        deviceId,
        locationId: location.id,
        status: 'OFFLINE',
        ipAddress: null,
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        location,
        deviceId: arduinoConnection.deviceId,
        message: 'Lokasi berhasil ditambahkan'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { error: 'Gagal menambahkan lokasi' },
      { status: 500 }
    )
  }
}
