'use client'

import { useState, useRef } from 'react'
import { uploadImageToCloudinary, validateImageFile } from '@/lib/cloudinary'

interface ImageUploadProps {
  folder?: string
  onUpload: (url: string, publicId: string) => void
  onError?: (error: string) => void
  maxSizeMB?: number
  disabled?: boolean
}

export default function ImageUpload({
  folder = 'rvm-admin',
  onUpload,
  onError,
  maxSizeMB = 5,
  disabled = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file, maxSizeMB)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      onError?.(validation.error || 'Invalid file')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setIsLoading(true)
    setError(null)

    const result = await uploadImageToCloudinary(file, folder)

    if (result.success) {
      onUpload(result.url, result.publicId)
      setError(null)
    } else {
      setError(result.error || 'Upload failed')
      onError?.(result.error || 'Upload failed')
      setPreview(null)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          transition-all duration-300 cursor-pointer
          ${disabled || isLoading 
            ? 'opacity-50 cursor-not-allowed border-gray-200' 
            : 'border-gray-300 hover:border-primary hover:bg-primary/5 group'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isLoading}
          className="hidden"
        />

        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-xl shadow-sm"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm font-bold uppercase tracking-wider">Mengunggah...</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <span className="text-white bg-black/50 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-md">Ubah Gambar</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <svg
                className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 20M8 20l3.172-3.172a4 4 0 015.656 0L24 20"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
              {isLoading ? 'Sedang mengunggah...' : 'Pilih Gambar'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, WebP atau GIF. Maks {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
