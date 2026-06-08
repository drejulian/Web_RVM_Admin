'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
  const pathname = usePathname()

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

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/users', label: 'Users', icon: '👥' },
    { href: '/dashboard/locations', label: 'Locations', icon: '📍' },
    { href: '/dashboard/devices', label: 'Devices', icon: '🖥️' },
    { href: '/dashboard/transactions', label: 'Transactions', icon: '💰' },
    { href: '/dashboard/news', label: 'News', icon: '📰' },
    { href: '/dashboard/vouchers', label: 'Vouchers', icon: '🎟️' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30 shadow-sm`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#00B1FF] w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="svg/image-splash.svg" alt="Logo" className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg leading-tight">RVM Admin</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Management System</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Toggle Sidebar Button */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="w-full flex items-center justify-center h-10 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-primary"
          >
            {sidebarOpen ? (
              <span className="text-xl">❮</span>
            ) : (
              <span className="text-xl">❯</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
          <div className="h-full flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                {navItems.find(item => item.href === pathname)?.label || 'Panel'}
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{admin?.nama}</p>
                  <p className="text-[11px] text-primary font-bold uppercase tracking-wider">{admin?.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {admin?.nama?.charAt(0) || 'A'}
                </div>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span>Keluar</span>
                <span className="text-lg">➔</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
