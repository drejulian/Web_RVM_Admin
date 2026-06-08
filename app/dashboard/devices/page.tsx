'use client'

import { useEffect, useState } from 'react'

interface Device {
  id: string
  deviceId: string
  locationId: string | null
  ipAddress: string | null
  status: string
  lastPing: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDevices, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices')
      const data = await response.json()
      setDevices(data.devices)
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-100 text-green-800'
      case 'DISCONNECTED':
        return 'bg-gray-100 text-gray-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return '✅'
      case 'DISCONNECTED':
        return '⚪'
      case 'FAILED':
        return '❌'
      default:
        return '❓'
    }
  }

  const formatLastPing = (lastPing: string) => {
    const date = new Date(lastPing)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`
    
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Perangkat</h1>
          <p className="text-sm text-gray-500">Pantau status koneksi dan kesehatan RVM secara real-time</p>
        </div>
        <button
          onClick={fetchDevices}
          className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm border border-gray-100 flex items-center gap-2 w-fit"
        >
          <span>🔄</span>
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Perangkat</p>
            <p className="text-3xl font-bold text-gray-800">
              {devices.length}
            </p>
          </div>
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔌</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Terhubung</p>
            <p className="text-3xl font-bold text-green-600">
              {devices.filter((d) => d.status === 'CONNECTED').length}
            </p>
          </div>
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">✅</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Terputus</p>
            <p className="text-3xl font-bold text-red-600">
              {devices.filter((d) => d.status !== 'CONNECTED').length}
            </p>
          </div>
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">❌</div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Perangkat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ping Terakhir</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">{device.deviceId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono text-xs">{device.locationId || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono text-xs">{device.ipAddress || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full shadow-sm ${getStatusColor(
                        device.status
                      )}`}
                    >
                      {getStatusIcon(device.status)} <span className="ml-1">{device.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastPing(device.lastPing)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">⚙️</button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">📋</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No devices found
        </div>
      )}
    </div>
  )
}
