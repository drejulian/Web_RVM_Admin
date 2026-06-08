'use client'

import { useEffect, useState } from 'react'
import Modal from '@/app/components/Modal'
import ConfirmDialog from '@/app/components/ConfirmDialog'

interface BottleTransaction {
  id: string
  transactionType: string
  bottleCount: number
  pointsEarned: number
  timestamp: string
}

interface BottleCount {
  totalBottles: number
  points: number
  lifetimeCount: number
  lifetimePoints: number
  redeemableCount: number
  lastUpdated: string
  bottleTransactions?: BottleTransaction[]
}

interface User {
  id: string
  email: string
  nama: string
  phoneNumber: string
  createdAt: string
  bottleCount: BottleCount | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showViewModal, setShowViewModal] = useState(false)
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (user: User) => {
    setSelectedUser(user)
    setShowViewModal(true)
    setLoadingDetail(true)

    try {
      const response = await fetch(`/api/users/${user.id}`)
      const data = await response.json()
      setSelectedUser(data.user)
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleSuspendClick = (user: User) => {
    setSelectedUser(user)
    setShowSuspendConfirm(true)
  }

  const handleSuspendConfirm = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal suspend user')
      }

      setShowSuspendConfirm(false)
      setSelectedUser(null)
      await fetchUsers()
    } catch (err: any) {
      console.error('Suspend error:', err)
      alert('Error: ' + err.message)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phoneNumber.includes(search)
  )

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500">Kelola dan pantau aktivitas pengguna RVM Anda</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Total Botol
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {user.nama.charAt(0)}
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        {user.nama}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                      {user.bottleCount?.lifetimeCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold">
                      {user.bottleCount?.points || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        👁️
                      </button>
                      <button 
                        onClick={() => handleSuspendClick(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Suspend"
                      >
                        🚫
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}

      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedUser(null)
        }}
        title="User Details"
        maxWidth="2xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {loadingDetail && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            )}

            {!loadingDetail && (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-medium">{selectedUser.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="font-medium">{selectedUser.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">User ID</p>
                      <p className="text-sm font-mono">{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Registered</p>
                      <p className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bottle Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Current Bottles</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedUser.bottleCount?.totalBottles || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Redeemable</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedUser.bottleCount?.redeemableCount || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Lifetime Total</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedUser.bottleCount?.lifetimeCount || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Points</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {selectedUser.bottleCount?.points || 0}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lifetime Points Earned:</span>
                      <span className="font-semibold">
                        {selectedUser.bottleCount?.lifetimePoints || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold">
                        {selectedUser.bottleCount?.lastUpdated
                          ? new Date(selectedUser.bottleCount.lastUpdated).toLocaleString('id-ID')
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedUser.bottleCount?.bottleTransactions && selectedUser.bottleCount.bottleTransactions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bottles</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedUser.bottleCount.bottleTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  transaction.transactionType === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.transactionType}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm font-medium">{transaction.bottleCount}</td>
                              <td className="px-4 py-2 text-sm font-medium text-yellow-600">+{transaction.pointsEarned}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {new Date(transaction.timestamp).toLocaleString('id-ID')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowViewModal(false)
                      setSelectedUser(null)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showSuspendConfirm}
        onClose={() => {
          setShowSuspendConfirm(false)
          setSelectedUser(null)
        }}
        onConfirm={handleSuspendConfirm}
        title="Suspend User?"
        message={`Apakah Anda yakin ingin suspend user <span class="font-semibold">${selectedUser?.nama || ''}</span>? User ini akan dihapus dari sistem dan tidak dapat login lagi.`}
        confirmText="Ya, Suspend"
        cancelText="Batal"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        icon="danger"
      />
    </div>
  )
}
