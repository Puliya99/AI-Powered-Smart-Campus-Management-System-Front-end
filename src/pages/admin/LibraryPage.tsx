import React, { useState, useEffect } from 'react'
import {
  BookOpen, Search, Plus, Edit2, Trash2, RotateCcw,
  BookMarked, AlertTriangle, DollarSign, Archive,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import BookModal from '../../components/admin/Library/BookModal'
import BorrowModal from '../../components/admin/Library/BorrowModal'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface Book {
  id: string
  title: string
  author: string
  isbn: string | null
  category: string
  totalCopies: number
  availableCopies: number
  shelfLocation: string | null
  activeBorrowings?: number
}

interface Borrowing {
  id: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  status: string
  fineAmount: number
  finePerDay: number
  notes: string | null
  book: { id: string; title: string; author: string }
  borrower: { id: string; firstName: string; lastName: string; email: string; role: string }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const CATEGORY_LABELS: Record<string, string> = {
  TEXTBOOK: 'Textbook',
  REFERENCE: 'Reference',
  JOURNAL: 'Journal',
  MAGAZINE: 'Magazine',
  FICTION: 'Fiction',
  NON_FICTION: 'Non-Fiction',
  RESEARCH_PAPER: 'Research Paper',
  OTHER: 'Other',
}

const STATUS_STYLES: Record<string, string> = {
  BORROWED: 'bg-blue-100 text-blue-800',
  RETURNED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
}

const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'borrowings'>('books')

  // Books state
  const [books, setBooks] = useState<Book[]>([])
  const [bookPagination, setBookPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [bookSearch, setBookSearch] = useState('')
  const [bookCategory, setBookCategory] = useState('')

  // Borrowings state
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [borrowPagination, setBorrowPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 })
  const [borrowSearch, setBorrowSearch] = useState('')
  const [borrowStatus, setBorrowStatus] = useState('')

  // Stats
  const [bookStats, setBookStats] = useState({ totalBooks: 0, availableCopies: 0, borrowedCount: 0, overdueCount: 0, totalFines: 0 })

  // Modals
  const [showBookModal, setShowBookModal] = useState(false)
  const [editBook, setEditBook] = useState<Book | null>(null)
  const [showBorrowModal, setShowBorrowModal] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'books') fetchBooks()
    else fetchBorrowings()
  }, [activeTab, bookPagination.page, bookSearch, bookCategory, borrowPagination.page, borrowSearch, borrowStatus])

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/library/books/stats')
      setBookStats(res.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(bookPagination.page),
        limit: '10',
        search: bookSearch,
        ...(bookCategory && { category: bookCategory }),
      })
      const res = await axiosInstance.get(`/library/books?${params}`)
      setBooks(res.data.data.books)
      setBookPagination(res.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch books')
    } finally {
      setLoading(false)
    }
  }

  const fetchBorrowings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(borrowPagination.page),
        limit: '10',
        search: borrowSearch,
        ...(borrowStatus && { status: borrowStatus }),
      })
      const res = await axiosInstance.get(`/library/borrowings?${params}`)
      setBorrowings(res.data.data.borrowings)
      setBorrowPagination(res.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch borrowings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return
    try {
      await axiosInstance.delete(`/library/books/${id}`)
      toast.success('Book deleted')
      fetchBooks()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete book')
    }
  }

  const handleReturnBook = async (id: string) => {
    if (!window.confirm('Mark this book as returned?')) return
    try {
      await axiosInstance.put(`/library/borrowings/${id}/return`)
      toast.success('Book returned successfully')
      fetchBorrowings()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to return book')
    }
  }

  const onBookSuccess = () => {
    fetchBooks()
    fetchStats()
  }

  const onBorrowSuccess = () => {
    fetchBorrowings()
    fetchBooks()
    fetchStats()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
            <p className="text-gray-600 mt-1">Manage books, borrowings, and track inventory.</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'books' ? (
              <button
                onClick={() => { setEditBook(null); setShowBookModal(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" /> Add Book
              </button>
            ) : (
              <button
                onClick={() => setShowBorrowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" /> Record Borrow
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookStats.totalBooks}</p>
                <p className="text-xs text-gray-500">Total Books</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Archive className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookStats.availableCopies}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><BookMarked className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookStats.borrowedCount}</p>
                <p className="text-xs text-gray-500">Borrowed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookStats.overdueCount}</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'books' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('borrowings')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'borrowings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Borrowings
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'books' ? 'Search books by title, author, ISBN...' : 'Search by book title or borrower name...'}
              value={activeTab === 'books' ? bookSearch : borrowSearch}
              onChange={e => {
                if (activeTab === 'books') {
                  setBookSearch(e.target.value)
                  setBookPagination(p => ({ ...p, page: 1 }))
                } else {
                  setBorrowSearch(e.target.value)
                  setBorrowPagination(p => ({ ...p, page: 1 }))
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {activeTab === 'books' ? (
            <select
              value={bookCategory}
              onChange={e => { setBookCategory(e.target.value); setBookPagination(p => ({ ...p, page: 1 })) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          ) : (
            <select
              value={borrowStatus}
              onChange={e => { setBorrowStatus(e.target.value); setBorrowPagination(p => ({ ...p, page: 1 })) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="BORROWED">Borrowed</option>
              <option value="OVERDUE">Overdue</option>
              <option value="RETURNED">Returned</option>
            </select>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : activeTab === 'books' ? (
          /* Books Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shelf</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No books found</td></tr>
                  ) : books.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{book.isbn || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {CATEGORY_LABELS[book.category] || book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-medium ${book.availableCopies === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {book.availableCopies}
                        </span>
                        <span className="text-gray-400"> / {book.totalCopies}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{book.shelfLocation || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setEditBook(book); setShowBookModal(true) }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {bookPagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(bookPagination.page - 1) * bookPagination.limit + 1} to {Math.min(bookPagination.page * bookPagination.limit, bookPagination.total)} of {bookPagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={bookPagination.page <= 1}
                    onClick={() => setBookPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={bookPagination.page >= bookPagination.pages}
                    onClick={() => setBookPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Borrowings Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returned</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {borrowings.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No borrowings found</td></tr>
                  ) : borrowings.map(b => (
                    <tr key={b.id} className={`hover:bg-gray-50 ${b.status === 'OVERDUE' ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.book.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {b.borrower.firstName} {b.borrower.lastName}
                        <span className="ml-1 text-xs text-gray-400">({b.borrower.role})</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.borrowDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[b.status] || 'bg-gray-100 text-gray-700'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {Number(b.fineAmount) > 0 ? (
                          <span className="font-medium text-red-600">${Number(b.fineAmount).toFixed(2)}</span>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status !== 'RETURNED' && (
                          <button
                            onClick={() => handleReturnBook(b.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                          >
                            <RotateCcw className="h-3 w-3" /> Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {borrowPagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {(borrowPagination.page - 1) * borrowPagination.limit + 1} to {Math.min(borrowPagination.page * borrowPagination.limit, borrowPagination.total)} of {borrowPagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={borrowPagination.page <= 1}
                    onClick={() => setBorrowPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={borrowPagination.page >= borrowPagination.pages}
                    onClick={() => setBorrowPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <BookModal
        isOpen={showBookModal}
        onClose={() => { setShowBookModal(false); setEditBook(null) }}
        book={editBook}
        onSuccess={onBookSuccess}
      />
      <BorrowModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSuccess={onBorrowSuccess}
      />
    </DashboardLayout>
  )
}

export default LibraryPage
