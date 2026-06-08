# RVM Admin Panel

Admin panel untuk mengelola Reverse Vending Machine (RVM)

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
File `.env` sudah dikonfigurasi dengan database yang sama dengan user app.

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Schema ke Database (Jika belum)
```bash
npm run db:push
```

### 5. Create Default Admin
```bash
node scripts/create-admin.js
```

Default credentials:
- Email: `admin@rvm.com`
- Password: `Admin123!`

### 6. Run Development Server
```bash
npm run dev
```

Admin panel akan berjalan di: http://localhost:3001

## 📁 Struktur Folder

```
WEB_RVM_ADMIN/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── dashboard/    # Dashboard stats
│   │   └── users/        # User management
│   ├── dashboard/        # Dashboard pages
│   │   ├── users/        # User management page
│   │   ├── locations/    # Location management
│   │   ├── devices/      # Device management
│   │   └── ...
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth helpers
│   └── jwt.ts            # JWT utilities
├── prisma/
│   └── schema.prisma     # Database schema
└── middleware.ts         # Auth middleware
```

## 🔐 Authentication

Admin panel menggunakan JWT token yang disimpan di HTTP-only cookie untuk keamanan.

## 🎯 Features

### ✅ Sudah Tersedia:
- Login/Logout Admin
- Dashboard dengan statistik
- User Management (view, search)
- Protected routes dengan middleware

### 🚧 Dalam Development:
- RVM Location Management
- Device Management
- Transaction Management
- News Management
- Voucher Management
- Audit Logs
- Reports & Analytics

## 📊 Database

Admin panel terhubung ke database yang sama dengan user app. Schema mencakup:
- `Admin` - Data admin
- `AuditLog` - Log aktivitas admin
- `News` - Konten berita
- `Voucher` - Voucher untuk redeem
- `VoucherRedemption` - Riwayat redeem voucher
- `SystemConfig` - Konfigurasi sistem

Plus semua table user app:
- `User`, `UserBottleCount`
- `BottleTransaction`, `BottleCount`
- `RvmLocation`, `ArduinoConnection`

## 🛠️ Commands

```bash
# Development
npm run dev          # Run dev server (port 3001)

# Build
npm run build        # Build for production
npm start            # Run production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio
npm run db:push          # Push schema to database

# Linting
npm run lint         # Run ESLint
```

## 🔒 Security

- Passwords di-hash dengan bcryptjs
- JWT token untuk authentication
- HTTP-only cookies
- Protected API routes
- Middleware untuk route protection

## 📝 Notes

- Admin panel berjalan di port **3001**
- User app berjalan di port **3000**
- Keduanya terhubung ke database yang sama
- Pastikan user app tidak sedang berjalan jika ingin run migration

## 🐛 Troubleshooting

Jika ada error prisma client:
```bash
npm run prisma:generate
```

Jika database schema belum sinkron:
```bash
npm run db:push
```
