import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

interface UpdateNewsBody {
  title?: string
  content?: string
  image?: string | null
  imageUrl?: string
  category?: string
  isPublished?: boolean
}

interface JWTPayload {
  adminId: string
  email: string
  role: string
}

// GET single news
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const news = await prisma.news.findUnique({
      where: { id },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// UPDATE news
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params
    const { title, content, image, imageUrl, category, isPublished }: UpdateNewsBody = await request.json()

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    })

    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    // Use image if provided, otherwise use imageUrl, otherwise keep existing
    const finalImageUrl = image !== undefined ? image : (imageUrl !== undefined ? imageUrl : existingNews.imageUrl)

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(image !== undefined || imageUrl !== undefined) && { imageUrl: finalImageUrl },
        ...(category && { category }),
        ...(isPublished !== undefined && { isPublished }),
      },
    })

    return NextResponse.json({ news: updatedNews })
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

// DELETE news
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    })

    if (!existingNews) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      )
    }

    await prisma.news.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
