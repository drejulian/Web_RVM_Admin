import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const locationId = parseInt(params.id)
    const { imageUrl, publicId, action } = await request.json()

    if (!imageUrl || !publicId) {
      return NextResponse.json(
        { error: 'Image URL dan Public ID diperlukan' },
        { status: 400 }
      )
    }

    const location = await prisma.rvmLocation.findUnique({
      where: { id: locationId },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Lokasi tidak ditemukan' },
        { status: 404 }
      )
    }

    let images: Array<{ url: string; publicId: string }> = location.images 
      ? (location.images as Array<{ url: string; publicId: string }>)
      : []

    if (action === 'add') {
      // Add image to array
      images.push({ url: imageUrl, publicId })
      
      // Set as main image if it's the first one
      if (!location.image) {
        await prisma.rvmLocation.update({
          where: { id: locationId },
          data: {
            image: imageUrl,
            images: images,
          },
        })
      } else {
        await prisma.rvmLocation.update({
          where: { id: locationId },
          data: {
            images: images,
          },
        })
      }
    } else if (action === 'remove') {
      // Remove image from array
      images = images.filter(img => img.publicId !== publicId)
      
      // If removed image was main image, set new main image
      if (location.image === imageUrl) {
        await prisma.rvmLocation.update({
          where: { id: locationId },
          data: {
            image: images.length > 0 ? images[0].url : null,
            images: images.length > 0 ? images : null,
          },
        })
      } else {
        await prisma.rvmLocation.update({
          where: { id: locationId },
          data: {
            images: images.length > 0 ? images : null,
          },
        })
      }
    } else if (action === 'setMain') {
      // Set as main image
      await prisma.rvmLocation.update({
        where: { id: locationId },
        data: {
          image: imageUrl,
        },
      })
    }

    const updated = await prisma.rvmLocation.findUnique({
      where: { id: locationId },
    })

    return NextResponse.json({ location: updated })
  } catch (error) {
    console.error('Error managing location images:', error)
    return NextResponse.json(
      { error: 'Gagal mengelola gambar lokasi' },
      { status: 500 }
    )
  }
}
