# Setup & Deployment Guide - RVM Admin Panel

## 📦 Apa yang Sudah Dibuat?

### ✅ Struktur Project Lengkap
```
E:\WEB_RVM_ADMIN/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Login, Logout, Me
│   │   ├── dashboard/    # Dashboard stats
│   │   ├── users/        # User management API
│   │   ├── locations/    # Location management API
│   │   ├── devices/      # Device management API
│   │   └── transactions/ # Transaction API
│   ├── dashboard/        # Admin Pages
│   │   ├── layout.tsx    # Dashboard layout dengan sidebar
│   │   ├── page.tsx      # Dashboard home
│   │   ├── users/        # User management page
│   │   ├── locations/    # Location management
│   │   ├── devices/      # Device monitoring
│   │   ├── transactions/ # Transaction history
│   │   ├── news/         # News management (placeholder)
│   │   ├── vouchers/     # Voucher management (placeholder)
│   │   └── settings/     # Settings (placeholder)
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Password hashing
│   └── jwt.ts            # JWT utilities
├── prisma/
│   └── schema.prisma     # Database schema dengan admin models
├── scripts/
│   └── create-admin.js   # Script untuk create admin
├── middleware.ts         # Auth middleware
└── [config files]        # Next.js, TypeScript, Tailwind configs
```

### ✅ Database Schema yang Sudah Di-push
- **Admin** - Table untuk admin users
- **AuditLog** - Logging aktivitas admin
- **News** - Konten berita
- **Voucher** - Voucher management
- **VoucherRedemption** - Riwayat redeem
- **SystemConfig** - System configuration

### ✅ Fitur yang Sudah Jalan
1. **Authentication**
   - Login/Logout admin
   - JWT token dengan HTTP-only cookie
   - Protected routes dengan middleware
   - Role-based access (SUPER_ADMIN, ADMIN, OPERATOR, CONTENT_MANAGER)

2. **Dashboard**
   - Real-time statistics
   - Total users, bottles, transactions, points
   - Active devices & locations count

3. **User Management**
   - View all users
   - Search by name, email, phone
   - Display bottle count & points
   - User details

4. **Location Management**
   - View all RVM locations
   - Status monitoring (ACTIVE, MAINTENANCE, INACTIVE)
   - Capacity tracking
   - Operational hours

5. **Device Management**
   - Real-time device status
   - Connection monitoring
   - Last ping tracking
   - Auto-refresh every 30 seconds

6. **Transaction Management**
   - View all transactions
   - Filter by type (deposit, redeem, adjustment)
   - User info per transaction
   - Device tracking

## 🚀 Cara Menjalankan

### 1. Navigate ke Folder
```bash
cd E:\WEB_RVM_ADMIN
```

### 2. Install Dependencies (jika belum)
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Create Admin Account (jika belum)
```bash
node scripts/create-admin.js
```

Default credentials:
- Email: `admin@rvm.com`
- Password: `Admin123!`

### 5. Run Development Server

**Option 1: Port 3001** (default)
```bash
npm run dev
```

**Option 2: Port lain** (jika port 3001 terpakai)
```bash
npm run dev -- -p 3002
```

atau

```bash
npx next dev -p 3002
```

### 6. Akses Admin Panel
Buka browser:
- Port 3001: http://localhost:3001
- Port 3002: http://localhost:3002

### 7. Login
- Email: `admin@rvm.com`
- Password: `Admin123!`

## 🔧 Environment Variables

File `.env` sudah dikonfigurasi dengan:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="rahasia-super-aman-123"
NEXTAUTH_SECRET="rahasia-nextauth-admin-panel-123"
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**Note:** Jika menggunakan port lain, update `NEXTAUTH_URL` dan `NEXT_PUBLIC_API_URL`

## 📊 Database Connection

Admin panel terhubung ke database yang **sama** dengan user app:
- Database: PostgreSQL (Supabase)
- Connection pooling: Port 6543
- Direct connection: Port 5432
- Semua data user, locations, devices, transactions dapat diakses
- Admin models sudah di-push ke database

## 🎯 Fitur yang Perlu Dikembangkan Lebih Lanjut

### 1. **News Management** (placeholder sudah ada)
- Create/Edit/Delete berita
- Upload gambar
- Publish/unpublish
- Category management

### 2. **Voucher Management** (placeholder sudah ada)
- Create voucher codes
- Set point cost & value
- Stock management
- Expiry date tracking
- Approve/reject redemptions

### 3. **Settings** (placeholder sudah ada)
- System configuration
- Points per bottle
- Minimum redemption
- Email/notification templates

### 4. **Enhanced Features**
- Export data to CSV/Excel
- Advanced filtering & search
- Date range filters
- Audit log viewer
- User suspend/activate
- Bulk operations
- Charts & analytics
- Real-time notifications

## 🔐 Security Features

✅ **Sudah Implemented:**
- Password hashing dengan bcryptjs
- JWT token authentication
- HTTP-only cookies
- Protected API routes
- Middleware route protection
- Role-based access control

## 📱 Responsive Design

- Dashboard fully responsive
- Mobile-friendly sidebar (collapsible)
- Tailwind CSS untuk styling
- Modern UI dengan cards & tables

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Run dev server (port 3001)

# Build
npm run build            # Build for production
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run db:push          # Push schema changes

# Create Admin
node scripts/create-admin.js  # Create default admin

# Linting
npm run lint             # Run ESLint
```

## 🐛 Troubleshooting

### Port sudah terpakai
```bash
# Gunakan port berbeda
npm run dev -- -p 3002
```

### Prisma client error
```bash
npm run prisma:generate
```

### Database out of sync
```bash
npm run db:push
```

### Clear cache & reinstall
```bash
rm -rf node_modules .next
npm install
npm run prisma:generate
```

## 📝 Next Steps

1. **Test Login**
   - Buka http://localhost:3001/login
   - Login dengan credentials default
   - Explore semua menu

2. **Customize**
   - Update logo & branding
   - Modify colors di tailwind.config.js
   - Add more features sesuai kebutuhan

3. **Production Deployment**
   - Build: `npm run build`
   - Deploy ke Vercel/Netlify/VPS
   - Update environment variables
   - Setup custom domain

## 🎨 UI/UX Features

- Modern & clean design
- Green theme (eco-friendly)
- Responsive sidebar
- Real-time stats
- Status indicators dengan color coding
- Hover effects & transitions
- Table-based data display
- Search & filter functionality

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout admin
- `GET /api/auth/me` - Get current admin info

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users with bottle counts

### Locations
- `GET /api/locations` - Get all RVM locations

### Devices
- `GET /api/devices` - Get all Arduino devices

### Transactions
- `GET /api/transactions` - Get recent transactions

## 💡 Tips

1. **Development**
   - Gunakan Prisma Studio untuk explore database: `npm run prisma:studio`
   - Check console untuk errors
   - Use React DevTools untuk debugging

2. **Production**
   - Always test di localhost dulu
   - Backup database sebelum migration
   - Use environment variables untuk sensitive data
   - Enable HTTPS di production

3. **Security**
   - Jangan commit `.env` ke git
   - Change JWT_SECRET di production
   - Use strong admin passwords
   - Regular security updates

## ✅ Checklist Deployment

- [ ] Test all features di localhost
- [ ] Update environment variables
- [ ] Build successful (`npm run build`)
- [ ] Create production admin accounts
- [ ] Setup monitoring & logging
- [ ] Configure domain & SSL
- [ ] Test di production environment
- [ ] Document API untuk team

---

**Admin Panel sudah siap digunakan! 🎉**

Untuk pertanyaan atau issue, check console logs dan Prisma Studio untuk debugging.
