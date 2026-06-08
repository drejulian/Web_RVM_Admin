import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

interface UpdateLocationBody {
  name?: string
  address?: string
  latitude?: number
  longitude?: number
  capacity?: number
  operationalHours?: string
  contactNumber?: string
  status?: string
  image?: string | null  // JSON string of Cloudinary URLs
}

// GET single location
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const location = await prisma.rvmLocation.findUnique({
      where: { id: parseInt(id) },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ location })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    )
  }
}

// UPDATE location
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body: UpdateLocationBody = await request.json()
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

    // Update location
    const location = await prisma.rvmLocation.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address: address || null,
        position: {
          latitude: latitude || 0,
          longitude: longitude || 0,
        },
        capacity: capacity ? parseInt(capacity.toString()) : 100,
        operationalHours: operationalHours || '08:00-22:00',
        contactNumber: contactNumber || null,
        status: status || 'ACTIVE',
        image: image || null,
      },
    })

    return NextResponse.json({
      success: true,
      location,
      message: 'Lokasi berhasil diupdate',
    })
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate lokasi' },
      { status: 500 }
    )
  }
}

// DELETE location
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    console.log('DELETE location request received for ID:', id)
    
    const locationId = parseInt(id)
    console.log('Parsed location ID:', locationId)
    
    if (isNaN(locationId)) {
      console.error('Invalid location ID:', id)
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      )
    }

    const deletedLocation = await prisma.rvmLocation.delete({
      where: { id: locationId },
    })
    
    console.log('Location deleted successfully:', deletedLocation)

    return NextResponse.json({
      success: true,
      message: 'Lokasi berhasil dihapus',
    })
  } catch (error: any) {
    console.error('Error deleting location:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    
    return NextResponse.json(
      { 
        error: 'Gagal menghapus lokasi',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
