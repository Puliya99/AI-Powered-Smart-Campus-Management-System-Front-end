import React, { useState, useEffect } from 'react'
import {
  BookOpen, BookMarked, AlertTriangle, DollarSign,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface Borrowing {
  id: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: string
  fineAmount: number
  finePerDay: number
  notes: string | null
  book: {
    id: string
    title: string
    author: string
    category: string
  }
}

const STATUS_STYLES: Record<string, string> = {
  BORROWED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  RETURNED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const StudentLibraryPage: React.FC = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [stats, setStats] = useState({ currentlyBorrowed: 0, overdue: 0, totalFines: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'returned'>('all')

  useEffect(() => {
    fetchMyBorrowings()
  }, [])

  const fetchMyBorrowings = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/library/my-borrowings')
      setBorrowings(res.data.data.borrowings)
      setStats(res.data.data.stats)
    } catch (error) {
      toast.error('Failed to fetch library data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBorrowings = borrowings.filter(b => {
    if (filter === 'active') return b.status === 'BORROWED'
    if (filter === 'overdue') return b.status === 'OVERDUE'
    if (filter === 'returned') return b.status === 'RETURNED'
    return true
  })

  const getDaysInfo = (b: Borrowing) => {
    if (b.status === 'RETURNED') return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(b.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { text: `${Math.abs(diff)} day(s) overdue`, color: 'text-red-600' }
    if (diff === 0) return { text: 'Due today', color: 'text-amber-600' }
    return { text: `${diff} day(s) remaining`, color: 'text-green-600' }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View your borrowed books and return status.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg"><BookMarked className="h-6 w-6 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentlyBorrowed}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Currently Borrowed</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg"><DollarSign className="h-6 w-6 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalFines.toFixed(2)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Fines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'active', 'overdue', 'returned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : f === 'overdue' ? 'Overdue' : 'Returned'}
            </button>
          ))}
        </div>

        {/* Borrowings */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredBorrowings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No borrowings found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filter === 'all' ? "You haven't borrowed any books yet." : `No ${filter} borrowings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBorrowings.map(b => {
              const daysInfo = getDaysInfo(b)
              return (
                <div
                  key={b.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden ${
                    b.status === 'OVERDUE' ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{b.book.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{b.book.author}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Borrowed</span>
                        <span className="text-gray-700 dark:text-gray-300">{new Date(b.borrowDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                        <span className="text-gray-700 dark:text-gray-300">{new Date(b.dueDate).toLocaleDateString()}</span>
                      </div>
                      {b.returnDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Returned</span>
                          <span className="text-gray-700 dark:text-gray-300">{new Date(b.returnDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {Number(b.fineAmount) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Fine</span>
                          <span className="font-medium text-red-600">${Number(b.fineAmount).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {daysInfo && (
                    <div className={`px-5 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700`}>
                      <p className={`text-xs font-medium ${daysInfo.color}`}>{daysInfo.text}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentLibraryPage
