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
          relative border-2 border-dashed border-gray-300 rounded-lg p-6
          transition-colors cursor-pointer
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}
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
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-sm mt-2">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-2 text-sm text-gray-600">
              {isLoading ? 'Uploading...' : 'Klik atau drag gambar ke sini'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP atau GIF. Max {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
