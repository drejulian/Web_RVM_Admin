import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const imageIndex = searchParams.get('index') || '0'

    const location = await prisma.rvmLocation.findUnique({
      where: { id: parseInt(id) },
    })

    if (!location || !location.image) {
      return new NextResponse(null, { status: 404 })
    }

    try {
      const images = JSON.parse(location.image)
      const index = parseInt(imageIndex)

      if (!Array.isArray(images) || index < 0 || index >= images.length) {
        return new NextResponse(null, { status: 404 })
      }

      const base64Image = images[index]

      // Extract base64 data and mime type
      const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/)
      if (!matches) {
        return new NextResponse(null, { status: 400 })
      }

      const mimeType = matches[1]
      const base64Data = matches[2]

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64')

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch (parseError) {
      return new NextResponse(null, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching image:', error)
    return new NextResponse(null, { status: 500 })
  }
}
