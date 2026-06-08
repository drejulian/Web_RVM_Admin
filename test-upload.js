const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('Testing Cloudinary Upload...');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

    // Check if test image exists
    const testImagePath = path.join(__dirname, 'public/png/test-image.png');
    if (!fs.existsSync(testImagePath)) {
      console.log('Creating test image...');
      // Buat simple PNG untuk testing
      const png = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE,
        0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE5, 0x27, 0xDE, 0xFC, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
      ]);
      fs.writeFileSync(testImagePath, png);
      console.log('✓ Test image created');
    }

    // Read file
    const fileStream = fs.createReadStream(testImagePath);
    const form = new FormData();
    form.append('file', fileStream, 'test-image.png');
    form.append('folder', 'rvm-admin/test');

    console.log('Uploading to http://localhost:3001/api/upload...');
    
    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: form,
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Upload successful!');
      console.log('URL:', data.url);
      console.log('PublicId:', data.publicId);
    } else {
      console.error('✗ Upload failed:');
      console.error('Status:', response.status);
      console.error('Error:', data);
    }

  } catch (error) {
    console.error('✗ Test error:', error.message);
  }
}

testUpload();
