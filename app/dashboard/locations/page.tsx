'use client'

import { useEffect, useState } from 'react'
import Modal from '@/app/components/Modal'
import ConfirmDialog from '@/app/components/ConfirmDialog'
import LocationImageManager from '@/app/components/LocationImageManager'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

interface Position {
  latitude: number
  longitude: number
}

interface Location {
  id: number
  name: string
  address: string | null
  position: Position | null
  capacity: number
  currentStock: number
  capacityStatus: string
  operationalHours: string
  contactNumber: string | null
  status: string
  image: string | null
  images?: Array<{ url: string; publicId: string }> | null
  createdAt: string
}

interface LocationFormData {
  name: string
  address: string
  latitude: string
  longitude: string
  capacity: string
  operationalHours: string
  contactNumber: string
  status: string
  images: string[]  // Array of base64 images
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    capacity: '100',
    operationalHours: '08:00-22:00',
    contactNumber: '',
    status: 'ACTIVE',
    images: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations')
      const data = await response.json()
      setLocations(data.locations)
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // 1. Upload base64 images to Cloudinary and get URLs
      const cloudinaryUrls: string[] = []
      
      for (const imageBase64 of formData.images) {
        // Skip if already a URL (from existing location)
        if (imageBase64.startsWith('http://') || imageBase64.startsWith('https://')) {
          cloudinaryUrls.push(imageBase64)
          continue
        }

        // Convert base64 to File and upload
        try {
          const blob = await fetch(imageBase64).then(res => res.blob())
          const file = new File([blob], 'location-image.jpg', { type: 'image/jpeg' })
          
          const response = await uploadImageToCloudinary(file, 'rvm-locations')
          if (response.success) {
            cloudinaryUrls.push(response.url)
          } else {
            throw new Error(response.error || 'Gagal upload gambar ke Cloudinary')
          }
        } catch (err: any) {
          throw new Error(`Gagal upload gambar: ${err.message}`)
        }
      }

      // 2. Send location data with Cloudinary URLs to backend
      const url = editMode && selectedLocation 
        ? `/api/locations/${selectedLocation.id}`
        : '/api/locations'
      
      const method = editMode ? 'PUT' : 'POST'

      const dataToSend = {
        ...formData,
        image: cloudinaryUrls.length > 0 ? JSON.stringify(cloudinaryUrls) : null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Gagal ${editMode ? 'mengupdate' : 'menambahkan'} lokasi`)
      }

      // Reset form and close modal
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        capacity: '100',
        operationalHours: '08:00-22:00',
        contactNumber: '',
        status: 'ACTIVE',
        images: [],
      })
      setShowModal(false)
      setEditMode(false)
      setSelectedLocation(null)
      
      // Refresh locations
      fetchLocations()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = [...formData.images]
      let filesProcessed = 0
      
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result as string)
          filesProcessed++
          
          if (filesProcessed === files.length) {
            setFormData({
              ...formData,
              images: newImages,
            })
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: newImages,
    })
  }

  const handleEdit = (location: Location) => {
    const position = location.position
    setSelectedLocation(location)
    
    // Parse images from JSON string
    let images: string[] = []
    if (location.image) {
      try {
        images = JSON.parse(location.image)
      } catch {
        images = []
      }
    }
    
    setFormData({
      name: location.name,
      address: location.address || '',
      latitude: position?.latitude?.toString() || '',
      longitude: position?.longitude?.toString() || '',
      capacity: location.capacity.toString(),
      operationalHours: location.operationalHours,
      contactNumber: location.contactNumber || '',
      status: location.status,
      images: images,
    })
    setEditMode(true)
    setShowModal(true)
  }

  const handleView = (location: Location) => {
    setSelectedLocation(location)
    setShowViewModal(true)
  }

  const handleDeleteClick = (location: Location) => {
    setSelectedLocation(location)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedLocation) return

    console.log('Attempting to delete location:', selectedLocation.id)

    try {
      const url = `/api/locations/${selectedLocation.id}`
      console.log('Delete URL:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
      })

      console.log('Delete response status:', response.status)
      const data = await response.json()
      console.log('Delete response data:', data)

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Gagal menghapus lokasi')
      }

      // Close modal and refresh on success
      console.log('Delete successful, closing modal and refreshing')
      setShowDeleteConfirm(false)
      setSelectedLocation(null)
      await fetchLocations()
    } catch (err: any) {
      console.error('Delete error:', err)
      alert('Error: ' + err.message)
      // Keep modal open on error so user can see what happened
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedLocation(null)
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      capacity: '100',
      operationalHours: '08:00-22:00',
      contactNumber: '',
      status: 'ACTIVE',
      images: [],
    })
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCapacityColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'ALMOST_FULL':
        return 'bg-yellow-100 text-yellow-800'
      case 'FULL':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Lokasi RVM</h1>
          <p className="text-sm text-gray-500">Pantau status dan kapasitas di semua titik pemasangan</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 w-fit"
        >
          <span>➕</span>
          <span>Tambah Lokasi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div
            key={location.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="relative">
              {location.image ? (() => {
                try {
                  const images = JSON.parse(location.image)
                  return images.length > 0 ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={images[0]}
                        alt={location.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                          +{images.length - 1} FOTO
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📍</span>
                    </div>
                  )
                } catch {
                  return (
                    <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📍</span>
                    </div>
                  )
                }
              })() : (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📍</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm backdrop-blur-md ${getStatusColor(
                    location.status
                  )}`}
                >
                  {location.status}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                {location.name}
              </h3>
              
              <div className="flex items-start gap-2 mb-4">
                <span className="text-gray-400 mt-0.5">📍</span>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {location.address || 'Alamat tidak tersedia'}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                    <span>Kapasitas</span>
                    <span>{location.currentStock} / {location.capacity} Botol</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        (location.currentStock / location.capacity) > 0.8 ? 'bg-red-500' : 
                        (location.currentStock / location.capacity) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((location.currentStock / location.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🕒</span>
                    <span className="text-xs text-gray-600 font-medium">{location.operationalHours}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCapacityColor(
                      location.capacityStatus
                    )}`}
                  >
                    {location.capacityStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => handleEdit(location)}
                  className="flex-1 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-all border border-gray-100 hover:border-blue-100"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleView(location)}
                  className="flex-1 px-3 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Detail
                </button>
                <button 
                  onClick={() => handleDeleteClick(location)}
                  className="p-2.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs transition-all border border-red-100"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No locations found
        </div>
      )}

      {/* Modal Add/Edit Location */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditMode(false)
          setSelectedLocation(null)
          setError('')
        }}
        title={editMode ? 'Edit Location' : 'Add New Location'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., RVM Surabaya Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Complete address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="-7.250445"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="112.768845"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (bottles)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operational Hours
            </label>
            <input
              type="text"
              name="operationalHours"
              value={formData.operationalHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="08:00-22:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+62 812-3456-7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Lokasi (Bisa Mehrere)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {formData.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Location preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formData.images.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Belum ada foto</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update Location' : 'Add Location')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setEditMode(false)
                setSelectedLocation(null)
                setError('')
              }}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal View Details */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedLocation(null)
        }}
        title="Location Details"
        maxWidth="2xl"
      >
        {selectedLocation && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedLocation.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                    selectedLocation.status
                  )}`}
                >
                  {selectedLocation.status}
                </span>
              </div>

              {selectedLocation.image && (() => {
                try {
                  const images = JSON.parse(selectedLocation.image)
                  return images.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Foto Lokasi ({images.length})</p>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image: string, index: number) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedLocation.name} - ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null
                } catch {
                  return null
                }
              })()}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-medium">
                    {selectedLocation.address || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                  <p className="font-medium">
                    {selectedLocation.contactNumber || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacity</p>
                  <p className="font-medium">
                    {selectedLocation.currentStock} / {selectedLocation.capacity} bottles
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capacity Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${getCapacityColor(
                      selectedLocation.capacityStatus
                    )}`}
                  >
                    {selectedLocation.capacityStatus}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Operational Hours</p>
                <p className="font-medium">{selectedLocation.operationalHours}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Latitude</p>
                  <p className="font-medium">
                    {selectedLocation.position?.latitude || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Longitude</p>
                  <p className="font-medium">
                    {selectedLocation.position?.longitude || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created At</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedLocation.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location ID</p>
                  <p className="text-sm font-medium">#{selectedLocation.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Kelola Gambar</h3>
              <LocationImageManager
                locationId={selectedLocation.id}
                mainImage={selectedLocation.image || undefined}
                images={(selectedLocation.images as Array<{ url: string; publicId: string }>) || []}
                onImagesUpdate={(images, mainImage) => {
                  setSelectedLocation({
                    ...selectedLocation,
                    image: mainImage || null,
                    images: images,
                  })
                  fetchLocations()
                }}
              />
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t">
              <button
                onClick={() => {
                  setShowViewModal(false)
                  handleEdit(selectedLocation)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Edit Location
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedLocation(null)
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedLocation(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Apakah Anda yakin hapus?"
        message={`Lokasi <span class="font-semibold">${selectedLocation?.name || ''}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="danger"
      />
    </div>
  )
}
