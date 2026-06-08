/**
 * Utility functions untuk Cloudinary image operations
 */

export interface CloudinaryUploadResponse {
  success: boolean
  url: string
  publicId: string
  error?: string
}

/**
 * Upload image ke Cloudinary melalui API endpoint
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'rvm-admin'
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        url: '',
        publicId: '',
        error: error.error || 'Upload failed',
      }
    }

    const data = await response.json()
    return {
      success: true,
      url: data.url,
      publicId: data.publicId,
    }
  } catch (error) {
    return {
      success: false,
      url: '',
      publicId: '',
      error: String(error),
    }
  }
}

/**
 * Delete image dari Cloudinary melalui backend
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.error || 'Delete failed',
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF',
    }
  }

  const maxBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}
