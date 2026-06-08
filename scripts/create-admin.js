// Script untuk membuat admin pertama kali
// Run: node scripts/create-admin.js

const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDefaultAdmin() {
  try {
    console.log('Creating default admin...')

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@rvm.com' },
    })

    if (existingAdmin) {
      console.log('❌ Admin already exists!')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!', 10)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@rvm.com',
        nama: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    })

    console.log('✅ Default admin created successfully!')
    console.log('Email:', admin.email)
    console.log('Password: Admin123!')
    console.log('Role:', admin.role)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultAdmin()
