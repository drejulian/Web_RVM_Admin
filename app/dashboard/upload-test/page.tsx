'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/app/components/ImageUpload'
import LocationImageManager from '@/app/components/LocationImageManager'

interface Location {
  id: number
  name: string
  image?: string
  images?: Array<{ url: string; publicId: string }>
}

export default function UploadTestPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data = await response.json()
      setLocations(data.locations)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  const currentLocation = locations.find(l => l.id === selectedLocation)

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Upload Gambar ke Cloudinary</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Pilih Lokasi RVM:</label>
        <select
          value={selectedLocation || ''}
          onChange={(e) => setSelectedLocation(parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Pilih Lokasi --</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name} (ID: {location.id})
            </option>
          ))}
        </select>
      </div>

      {selectedLocation && currentLocation && (
        <div className="border border-gray-300 rounded-lg p-8 bg-gray-50">
          <h2 className="text-xl font-semibold mb-6">{currentLocation.name}</h2>
          
          <div className="bg-white p-6 rounded border border-gray-200">
            <LocationImageManager
              locationId={currentLocation.id}
              mainImage={currentLocation.image}
              images={currentLocation.images as Array<{ url: string; publicId: string }> || []}
              onImagesUpdate={(images, mainImage) => {
                setLocations(locations.map(l => 
                  l.id === currentLocation.id
                    ? { ...l, image: mainImage || undefined, images: images }
                    : l
                ))
              }}
            />
          </div>

          {currentLocation.image && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Gambar Utama:</h3>
              <img 
                src={currentLocation.image} 
                alt="Main" 
                className="w-full max-w-md h-64 object-cover rounded border"
              />
            </div>
          )}

          {currentLocation.images && currentLocation.images.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Semua Gambar ({currentLocation.images.length}):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentLocation.images.map((img, idx) => (
                  <div key={idx} className="border rounded overflow-hidden">
                    <img 
                      src={img.url} 
                      alt={`Image ${idx}`} 
                      className="w-full h-48 object-cover"
                    />
                    <p className="text-xs text-gray-600 p-2 truncate">{img.publicId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">💡 Petunjuk:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Pilih lokasi RVM dari dropdown di atas</li>
          <li>Click atau drag gambar ke area upload</li>
          <li>Tunggu gambar ter-upload ke Cloudinary</li>
          <li>Gambar akan ditampilkan dengan URL Cloudinary (bukan base64)</li>
          <li>Anda bisa set gambar utama, tambah multiple images, atau hapus</li>
        </ol>
      </div>
    </div>
  )
}
