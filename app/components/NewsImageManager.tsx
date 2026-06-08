'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'

interface NewsImageManagerProps {
  newsId: string
  currentImageUrl?: string
  onImageUpdate?: (imageUrl: string) => void
}

export default function NewsImageManager({
  newsId,
  currentImageUrl,
  onImageUpdate,
}: NewsImageManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null)
  const [publicId, setPublicId] = useState<string | null>(null)

  const handleImageUpload = async (url: string, id: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Delete old image if exists
      if (publicId) {
        await deleteImageFromCloudinary(publicId)
      }

      // Update news with new image
      const response = await fetch(`/api/news/${newsId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: url,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update image')
      }

      const data = await response.json()
      setImageUrl(data.news.imageUrl)
      setPublicId(id)
      setSuccess('Gambar berhasil diupdate')
      onImageUpdate?.(data.news.imageUrl)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (publicId) {
        await deleteImageFromCloudinary(publicId)
      }

      // Remove image from database
      const response = await fetch(`/api/news/${newsId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove image')
      }

      setImageUrl(null)
      setPublicId(null)
      setSuccess('Gambar berhasil dihapus')
      onImageUpdate?.(null)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!imageUrl ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upload Gambar Berita</h3>
          <ImageUpload
            folder={`rvm-news/${newsId}`}
            onUpload={handleImageUpload}
            onError={setError}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Gambar Berita</h3>
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt="News"
              className="w-full max-w-md h-64 object-cover rounded"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Hapus Gambar
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Ganti gambar?</p>
            <ImageUpload
              folder={`rvm-news/${newsId}`}
              onUpload={handleImageUpload}
              onError={setError}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  )
}
