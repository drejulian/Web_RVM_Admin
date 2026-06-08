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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-primary-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
            </div>
            <div className="text-6xl opacity-20">👥</div>
          </div>
        </div>

        {/* Total Bottles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bottles Collected</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mt-2">
                {stats?.totalBottles || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
            </div>
            <div className="text-6xl opacity-20">♻️</div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {stats?.totalTransactions || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 15% from last month</p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points Earned</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {stats?.totalPoints || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 20% from last month</p>
            </div>
            <div className="text-6xl opacity-20">⭐</div>
          </div>
        </div>

        {/* Active Devices */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Devices</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {stats?.activeDevices || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 5% from last month</p>
            </div>
            <div className="text-6xl opacity-20">🔌</div>
          </div>
        </div>

        {/* Active Locations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Locations</p>
              <p className="text-4xl font-bold text-red-600 mt-2">
                {stats?.activeLocations || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">↑ 3% from last month</p>
            </div>
            <div className="text-6xl opacity-20">📍</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottle Collection Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary-500">📈</span> Bottle Collection Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorBottles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B1FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00B1FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #00B1FF',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Area type="monotone" dataKey="bottles" stroke="#00B1FF" strokeWidth={3} fillOpacity={1} fill="url(#colorBottles)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary-500">👥</span> User Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #00B1FF',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#00B1FF" strokeWidth={3} dot={{ fill: '#00B1FF', r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Points Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary-500">📊</span> Monthly Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #00B1FF',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="bottles" fill="#00B1FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="points" fill="#FFB800" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary-500">🔌</span> Device Status
          </h2>
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
                  border: '1px solid #00B1FF',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-primary-500">🕒</span> Recent Activities
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">New user registered</p>
              <p className="text-sm text-gray-600">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Bottle collection completed</p>
              <p className="text-sm text-gray-600">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              P
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Points redeemed</p>
              <p className="text-sm text-gray-600">10 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              D
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Device connected</p>
              <p className="text-sm text-gray-600">15 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
