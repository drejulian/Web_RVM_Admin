// Script untuk test Cloudinary configuration
// Run: node scripts/test-cloudinary.js

const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('🔍 Cloudinary Configuration Check:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set')
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set')

// Test API
console.log('\n📡 Testing API Connection...')
cloudinary.api.resources({ max_results: 1 }, (error, result) => {
  if (error) {
    console.log('❌ Error:', error.message)
    console.log('\nPossible issues:')
    console.log('1. Cloud name tidak sesuai')
    console.log('2. API Key salah')
    console.log('3. API Secret salah')
  } else {
    console.log('✅ Connection successful!')
    console.log('Resources:', result.resources.length)
  }
})
