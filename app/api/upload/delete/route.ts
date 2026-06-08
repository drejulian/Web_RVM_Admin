import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID tidak ditemukan' },
        { status: 400 }
      )
    }

    // Delete dari Cloudinary
    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      message: 'Image berhasil dihapus',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus gambar', details: String(error) },
      { status: 500 }
    )
  }
}
