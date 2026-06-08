'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Admin {
  id: string
  nama: string
  email: string
  role: string
}

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setAdmin(data.admin)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-primary-700">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-sm'}`}>
            {sidebarOpen ? 'RVM Admin' : 'RVM'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>📊</span>
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/users" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>👥</span>
                {sidebarOpen && <span>Users</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/locations" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>📍</span>
                {sidebarOpen && <span>Locations</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/devices" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>🖥️</span>
                {sidebarOpen && <span>Devices</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/transactions" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>💰</span>
                {sidebarOpen && <span>Transactions</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/news" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>📰</span>
                {sidebarOpen && <span>News</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/vouchers" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>🎟️</span>
                {sidebarOpen && <span>Vouchers</span>}
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-500/20 transition-all">
                <span>⚙️</span>
                {sidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Toggle Sidebar Button */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-all"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg border-b-2 border-primary-500">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <div className="flex items-center gap-4">
              <div className="text-right bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-gray-800">{admin?.nama}</p>
                <p className="text-xs text-primary-600 font-medium">{admin?.role}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
