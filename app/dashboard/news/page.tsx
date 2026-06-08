'use client'

import { useEffect, useState } from 'react'
import Modal from '@/app/components/Modal'
import ConfirmDialog from '@/app/components/ConfirmDialog'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

interface News {
  id: number | string
  title: string
  content: string
  image?: string | null
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

interface NewsFormData {
  title: string
  content: string
  images: string[]  // Array of base64 images
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    images: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNewsList(data.news || [])
    } catch (error) {
      console.error('Error fetching news:', error)
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
        // Skip if already a URL (from existing news)
        if (imageBase64.startsWith('http://') || imageBase64.startsWith('https://')) {
          cloudinaryUrls.push(imageBase64)
          continue
        }

        // Convert base64 to File and upload
        try {
          const blob = await fetch(imageBase64).then(res => res.blob())
          const file = new File([blob], 'news-image.jpg', { type: 'image/jpeg' })
          
          const response = await uploadImageToCloudinary(file, 'rvm-news')
          if (response.success) {
            cloudinaryUrls.push(response.url)
          } else {
            throw new Error(response.error || 'Gagal upload gambar ke Cloudinary')
          }
        } catch (err: any) {
          throw new Error(`Gagal upload gambar: ${err.message}`)
        }
      }

      // 2. Send news data with Cloudinary URL to backend
      const url = editMode && selectedNews 
        ? `/api/news/${selectedNews.id}`
        : '/api/news'
      
      const method = editMode ? 'PUT' : 'POST'

      const dataToSend = {
        title: formData.title,
        content: formData.content,
        image: cloudinaryUrls.length > 0 ? cloudinaryUrls[0] : null, // Use first image as main image
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Gagal ${editMode ? 'mengupdate' : 'menambahkan'} berita`)
      }

      // Reset form and close modal
      setFormData({
        title: '',
        content: '',
        images: [],
      })
      setShowModal(false)
      setEditMode(false)
      setSelectedNews(null)
      
      // Refresh news
      fetchNews()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleEdit = (news: News) => {
    setSelectedNews(news)
    
    // Get image from either image or imageUrl field
    let images: string[] = []
    const imageUrl = news.image || news.imageUrl
    if (imageUrl) {
      images = [imageUrl]
    }
    
    setFormData({
      title: news.title,
      content: news.content,
      images: images,
    })
    setEditMode(true)
    setShowModal(true)
  }

  const handleDeleteClick = (news: News) => {
    setSelectedNews(news)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedNews) return

    try {
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus berita')
      }

      setShowDeleteConfirm(false)
      setSelectedNews(null)
      await fetchNews()
    } catch (err: any) {
      alert('Error: ' + err.message)
    }
  }

  const handleAddNew = () => {
    setEditMode(false)
    setSelectedNews(null)
    setFormData({
      title: '',
      content: '',
      images: [],
    })
    setShowModal(true)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Berita</h1>
          <p className="text-sm text-gray-500">Kelola konten berita dan informasi untuk pengguna</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-6 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 w-fit"
        >
          <span>➕</span>
          <span>Tambah Berita</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="relative">
              {(news.image || news.imageUrl) ? (
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={news.image || news.imageUrl || ''}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-5xl">📰</span>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                {news.content}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
                <span>📅</span>
                <span className="font-medium">{new Date(news.createdAt).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(news)}
                  className="flex-1 px-3 py-2.5 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(news)}
                  className="px-3 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {newsList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No news found
        </div>
      )}

      {/* Modal Add/Edit News */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditMode(false)
          setSelectedNews(null)
          setError('')
        }}
        title={editMode ? 'Edit News' : 'Add New News'}
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
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Program Daur Ulang Botol"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Write your news content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {formData.images.length > 0 && (
              <div className="mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative inline-block">
                    <img
                      src={image}
                      alt={`News preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
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
              <p className="text-sm text-gray-500 mt-2">No image selected</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update News' : 'Add News')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setEditMode(false)
                setSelectedNews(null)
                setError('')
              }}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedNews(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete News?"
        message={`Are you sure you want to delete "<span class="font-semibold">${selectedNews?.title || ''}</span>"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="danger"
      />
    </div>
  )
}
