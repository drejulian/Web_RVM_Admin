import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

interface JWTPayload {
  adminId: string
  email: string
  role: string
}

interface CreateNewsBody {
  title: string
  content: string
  image?: string | null
  imageUrl?: string
  category?: string
  isPublished?: boolean
}

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token) as JWTPayload | null

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { title, content, image, imageUrl, category, isPublished }: CreateNewsBody = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use image if provided, otherwise use imageUrl, otherwise null
    const finalImageUrl = image || imageUrl || null

    const news = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl: finalImageUrl,
        category: category || 'General',
        isPublished: isPublished || false,
        createdBy: payload.adminId,
      },
    })

    return NextResponse.json({ news }, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
