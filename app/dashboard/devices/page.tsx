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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Device Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={fetchDevices}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Devices</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {devices.length}
              </p>
            </div>
            <div className="text-4xl">🔌</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {devices.filter((d) => d.status === 'CONNECTED').length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {devices.filter((d) => d.status !== 'CONNECTED').length}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Ping
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {device.deviceId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {device.locationId || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {device.ipAddress || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      device.status
                    )}`}
                  >
                    {getStatusIcon(device.status)} {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatLastPing(device.lastPing)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Configure
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No devices found
        </div>
      )}
    </div>
  )
}
