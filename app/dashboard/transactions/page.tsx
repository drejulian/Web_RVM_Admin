'use client'

import { useEffect, useState } from 'react'

interface User {
  nama: string
  email: string
}

interface UserBottleCount {
  user: User
}

interface Transaction {
  id: string
  transactionType: string
  deviceId: string | null
  bottleCount: number
  pointsEarned: number
  timestamp: string
  userBottleCount: UserBottleCount
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800'
      case 'redeem':
        return 'bg-blue-100 text-blue-800'
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '📥'
      case 'redeem':
        return '📤'
      case 'adjustment':
        return '⚙️'
      default:
        return '❓'
    }
  }

  const filteredTransactions =
    filter === 'ALL'
      ? transactions
      : transactions.filter((t) => t.transactionType === filter.toLowerCase())

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Transaksi</h1>
          <p className="text-sm text-gray-500">Pantau riwayat setoran botol dan penukaran poin</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        {['ALL', 'DEPOSIT', 'REDEEM', 'ADJUSTMENT'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              filter === type
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type === 'ALL' ? 'Semua' : type}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pengguna</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tipe</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Perangkat</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Botol</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Points</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-800">
                      {transaction.userBottleCount.user.nama}
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.userBottleCount.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full shadow-sm ${getTypeColor(
                        transaction.transactionType
                      )}`}
                    >
                      {getTypeIcon(transaction.transactionType)}{' '}
                      <span className="ml-1 uppercase">{transaction.transactionType}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500 font-mono">
                      {transaction.deviceId || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-gray-800">{transaction.bottleCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${transaction.transactionType === 'deposit' ? 'text-green-600' : 'text-primary'}`}>
                      {transaction.transactionType === 'deposit' ? '+' : ''}{transaction.pointsEarned}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{new Date(transaction.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                    <div className="text-[10px] text-gray-400">{new Date(transaction.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  )
}
