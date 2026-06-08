'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
  totalUsers: number
  totalBottles: number
  totalTransactions: number
  totalPoints: number
  activeDevices: number
  activeLocations: number
}

// Sample data for charts - replace with real data from API
const monthlyData = [
  { name: 'Jan', bottles: 4000, users: 2400, points: 2400 },
  { name: 'Feb', bottles: 3000, users: 1398, points: 2210 },
  { name: 'Mar', bottles: 2000, users: 9800, points: 2290 },
  { name: 'Apr', bottles: 2780, users: 3908, points: 2000 },
  { name: 'May', bottles: 1890, users: 4800, points: 2181 },
  { name: 'Jun', bottles: 2390, users: 3800, points: 2500 },
]

const deviceStatusData = [
  { name: 'Online', value: 400, color: '#00B1FF' },
  { name: 'Offline', value: 100, color: '#FF6B6B' },
  { name: 'Maintenance', value: 50, color: '#FFA500' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl font-semibold text-primary-500 animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Selamat Datang Kembali! 👋
          </h1>
          <p className="text-gray-500">Berikut ringkasan sistem RVM Anda</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <span className="text-gray-400">🕐</span>
          <span className="text-sm text-gray-600">{new Date().toLocaleString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 12%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Total Bottles */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                ♻️
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Botol Terkumpul</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mt-1">
                  {stats?.totalBottles || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 8%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                💰
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Transaksi</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {stats?.totalTransactions || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 15%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                ⭐
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Points</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {stats?.totalPoints || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 20%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Active Devices */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                🔌
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perangkat Aktif</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {stats?.activeDevices || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 5%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Active Locations */}
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi Aktif</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stats?.activeLocations || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">↑ 3%</span>
              <span className="text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottle Collection Trend */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <span>Tren Pengumpulan Botol</span>
            </h2>
            <span className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-medium">6 Bulan Terakhir</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorBottles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B1FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00B1FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Area type="monotone" dataKey="bottles" stroke="#00B1FF" strokeWidth={2} fillOpacity={1} fill="url(#colorBottles)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span>Pertumbuhan Pengguna</span>
            </h2>
            <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full font-medium">Trending Up</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="users" stroke="#00B1FF" strokeWidth={3} dot={{ fill: '#00B1FF', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Points Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Perbandingan Bulanan</span>
            </h2>
            <span className="text-xs px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full font-medium">Analitik</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="bottles" fill="#00B1FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="points" fill="#FFB800" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Status */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <span>Status Perangkat</span>
            </h2>
            <span className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-full font-medium">Real-time</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🕐</span>
            <span>Aktivitas Terbaru</span>
          </h2>
          <button className="text-sm text-primary hover:text-primary-600 font-medium transition-colors">
            Lihat Semua →
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Pengguna baru terdaftar</p>
              <p className="text-sm text-gray-500">Muhammad Ali bergabung dengan platform</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">2 menit lalu</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-green-50/50 hover:bg-green-50 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xl">♻️</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Pengumpulan botol berhasil</p>
              <p className="text-sm text-gray-500">25 botol dikumpulkan di RVM Surabaya Central</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">5 menit lalu</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-yellow-50/50 hover:bg-yellow-50 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xl">⭐</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Points ditukar</p>
              <p className="text-sm text-gray-500">150 points ditukar dengan voucher Indomaret</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">10 menit lalu</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-purple-50/50 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
              <span className="text-xl">🔌</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Perangkat terhubung</p>
              <p className="text-sm text-gray-500">RVM Jakarta Barat kembali online</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">15 menit lalu</span>
          </div>
        </div>
      </div>
    </div>
  )
}
