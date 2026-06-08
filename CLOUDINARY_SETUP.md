# Panduan Setup Cloudinary Integration

## Langkah 1: Setup Cloudinary Account

1. Buka website [Cloudinary](https://cloudinary.com)
2. Sign up untuk account baru (gratis)
3. Setelah login, cari **Cloud Name**, **API Key**, dan **API Secret** di dashboard Anda
4. Simpan informasi ini di tempat yang aman

## Langkah 2: Update Environment Variables

Buka file `.env` di root project dan update dengan credentials Cloudinary Anda:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**PENTING:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Bisa publik (diakses client-side)
- `CLOUDINARY_API_KEY` - JANGAN share, hanya untuk backend
- `CLOUDINARY_API_SECRET` - JANGAN share, hanya untuk backend

## Langkah 3: File & Component yang Sudah Dibuat

### API Endpoints

```
/api/upload                    - Upload gambar ke Cloudinary
/api/upload/delete            - Delete gambar dari Cloudinary
/api/locations/[id]/images    - Manage gambar di RVM Locations
/api/news/[id]/images         - Manage gambar di News
```

### Components

```
ImageUpload                   - Reusable component untuk upload gambar
LocationImageManager          - Manage multiple images untuk locations
NewsImageManager             - Manage single image untuk news
```

### Utility

```
lib/cloudinary.ts            - Helper functions untuk Cloudinary operations
```

## Langkah 4: Menggunakan ImageUpload Component

### Basic Usage

```tsx
import ImageUpload from '@/app/components/ImageUpload'

export default function MyComponent() {
  const handleUpload = (url: string, publicId: string) => {
    console.log('Image uploaded:', url)
    console.log('Public ID for deletion:', publicId)
    // Save ke database atau state
  }

  return (
    <ImageUpload
      folder="my-folder"  // Optional, default: "rvm-admin"
      onUpload={handleUpload}
      onError={(error) => console.error(error)}
      maxSizeMB={5}       // Optional
    />
  )
}
```

## Langkah 5: Menggunakan LocationImageManager

### Usage di Pages

```tsx
'use client'

import LocationImageManager from '@/app/components/LocationImageManager'

export default function LocationDetailsPage({ params }: { params: { id: string } }) {
  const locationId = parseInt(params.id)

  return (
    <div>
      <h1>Kelola Gambar Lokasi</h1>
      
      <LocationImageManager
        locationId={locationId}
        mainImage={location.image}
        images={location.images as Array<{url: string; publicId: string}>}
        onImagesUpdate={(images, mainImage) => {
          // Handle update
        }}
      />
    </div>
  )
}
```

## Langkah 6: Menggunakan NewsImageManager

### Usage di Pages

```tsx
'use client'

import NewsImageManager from '@/app/components/NewsImageManager'

export default function NewsEditorPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Edit Berita</h1>
      
      <NewsImageManager
        newsId={params.id}
        currentImageUrl={news.imageUrl}
        onImageUpdate={(imageUrl) => {
          // Handle update
        }}
      />
    </div>
  )
}
```

## Database Schema

### RvmLocation Fields

```prisma
model RvmLocation {
  image   String?  // Cloudinary image URL (main image)
  images  Json?    // Array of {url, publicId}
  // ... other fields
}
```

Format images field:
```json
[
  {
    "url": "https://res.cloudinary.com/...",
    "publicId": "rvm-locations/123-image-name"
  },
  {
    "url": "https://res.cloudinary.com/...",
    "publicId": "rvm-locations/124-image-name"
  }
]
```

### News Fields

```prisma
model News {
  imageUrl String?  // Cloudinary image URL
  // ... other fields
}
```

## API Responses

### Upload Image (POST /api/upload)

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "rvm-admin/1234567-filename"
}
```

### Delete Image (POST /api/upload/delete)

```json
{
  "success": true,
  "message": "Image berhasil dihapus"
}
```

### Add Image to Location (POST /api/locations/[id]/images)

```json
{
  "location": {
    "id": 1,
    "image": "https://res.cloudinary.com/...",
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "rvm-locations/123-image"
      }
    ]
  }
}
```

## Testing

### Test Upload dengan cURL

```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=test-folder"
```

### Test Delete dengan cURL

```bash
curl -X POST http://localhost:3001/api/upload/delete \
  -H "Content-Type: application/json" \
  -d '{"publicId":"rvm-admin/123-test"}'
```

## Troubleshooting

### Error: "Cloudinary config not found"

**Solusi:** Pastikan environment variables sudah di-set di `.env` dan restart dev server.

### Error: "Unauthorized"

**Solusi:** Check API Key dan API Secret di Cloudinary dashboard.

### Image tidak ter-upload

**Solusi:**
1. Check ukuran file (max 5MB default)
2. Check tipe file (supported: JPG, PNG, WebP, GIF)
3. Check network di browser console

### Upload lambat

**Solusi:** Normal jika file besar atau internet lambat. Cloudinary akan optimize otomatis.

## Best Practices

1. **Folder Organization**: Gunakan folder terpisah untuk setiap resource type
   - `rvm-locations/[locationId]` untuk lokasi
   - `rvm-news/[newsId]` untuk berita
   - `rvm-admin` untuk admin content

2. **Error Handling**: Selalu handle error response dari API

3. **Validation**: Validate file type dan size sebelum upload

4. **Cleanup**: Delete image dari Cloudinary sebelum delete dari database

5. **Performance**: Cloudinary otomatis optimize dan provide CDN

## Pricing

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth
- Unlimited transformations
- Bagus untuk development dan small projects

Cek pricing lebih lanjut di [Cloudinary Pricing](https://cloudinary.com/pricing)

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
