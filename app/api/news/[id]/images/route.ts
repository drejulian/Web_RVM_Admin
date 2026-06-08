import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const newsId = params.id
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL diperlukan' },
        { status: 400 }
      )
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'Berita tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update news with image URL
    const updated = await prisma.news.update({
      where: { id: newsId },
      data: {
        imageUrl: imageUrl,
      },
    })

    return NextResponse.json({ news: updated })
  } catch (error) {
    console.error('Error updating news image:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate gambar berita' },
      { status: 500 }
    )
  }
}
