import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all published news
export async function getAllNews() {
  try {
    const news = await prisma.news.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Get all news (including unpublished - for admin)
export async function getAllNewsAdmin() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Get news by ID
export async function getNewsById(id) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id,
      },
    });
    return news;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
}

// Create news (admin only)
export async function createNews(data) {
  try {
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
    return news;
  } catch (error) {
    console.error('Error creating news:', error);
    return null;
  }
}

// Update news (admin only)
export async function updateNews(id, data) {
  try {
    const news = await prisma.news.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });
    return news;
  } catch (error) {
    console.error('Error updating news:', error);
    return null;
  }
}

// Delete news (admin only)
export async function deleteNews(id) {
  try {
    await prisma.news.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    return false;
  }
}
