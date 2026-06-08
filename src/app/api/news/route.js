import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all news or GET single news by ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const news = await prisma.news.findUnique({
        where: { id },
      });
      return NextResponse.json(news);
    }

    // Get all news (including unpublished for admin)
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST create news
export async function POST(request) {
  try {
    const data = await request.json();

    const news = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        createdBy: data.createdBy,
        isPublished: data.isPublished || false,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT update news
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id } = data;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE news
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
