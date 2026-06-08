'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'

interface LocationImage {
  url: string
  publicId: string
}

interface LocationImageManagerProps {
  locationId: number
  mainImage?: string
  images?: LocationImage[]
  onImagesUpdate?: (images: LocationImage[], mainImage: string | null) => void
}

export default function LocationImageManager({
  locationId,
  mainImage,
  images = [],
  onImagesUpdate,
}: LocationImageManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [allImages, setAllImages] = useState<LocationImage[]>(images)

  const handleImageUpload = async (url: string, publicId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/locations/${locationId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: url,
          publicId: publicId,
          action: 'add',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add image')
      }

      const data = await response.json()
      const newImages: LocationImage[] = data.location.images || []
      
      setAllImages(newImages)
      setSuccess('Gambar berhasil ditambahkan')
      onImagesUpdate?.(newImages, data.location.image)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async (publicId: string, imageUrl: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Delete from Cloudinary
      await deleteImageFromCloudinary(publicId)

      // Remove from database
      const response = await fetch(`/api/locations/${locationId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          publicId: publicId,
          action: 'remove',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove image from database')
      }

      const data = await response.json()
      const newImages: LocationImage[] = data.location.images || []
      
      setAllImages(newImages)
      setSuccess('Gambar berhasil dihapus')
      onImagesUpdate?.(newImages, data.location.image)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetMainImage = async (imageUrl: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/locations/${locationId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          action: 'setMain',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to set main image')
      }

      const data = await response.json()
      setSuccess('Gambar utama berhasil diubah')
      onImagesUpdate?.(allImages, data.location.image)

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Tambah Gambar</h3>
        <ImageUpload
          folder={`rvm-locations/${locationId}`}
          onUpload={handleImageUpload}
          onError={setError}
          disabled={isLoading}
        />
      </div>

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

      {allImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Daftar Gambar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((image) => (
              <div key={image.publicId} className="relative group">
                <img
                  src={image.url}
                  alt="Location"
                  className={`w-full h-32 object-cover rounded ${
                    mainImage === image.url ? 'ring-4 ring-blue-500' : ''
                  }`}
                />

                {mainImage === image.url && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Gambar Utama
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {mainImage !== image.url && (
                    <button
                      onClick={() => handleSetMainImage(image.url)}
                      disabled={isLoading}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      Set as Main
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveImage(image.publicId, image.url)}
                    disabled={isLoading}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
