import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface BookOption {
  id: string
  title: string
  author: string
  isbn: string | null
  availableCopies: number
}

interface UserOption {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

const BorrowModal: React.FC<BorrowModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [books, setBooks] = useState<BookOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [formData, setFormData] = useState({
    bookId: '',
    borrowerId: '',
    dueDate: '',
    finePerDay: '0',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchDropdowns()
      setFormData({ bookId: '', borrowerId: '', dueDate: '', finePerDay: '0', notes: '' })
      setUserSearch('')
    }
  }, [isOpen])

  const fetchDropdowns = async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        axiosInstance.get('/library/books/dropdown'),
        axiosInstance.get('/library/users/dropdown'),
      ])
      setBooks(booksRes.data.data.books)
      setUsers(usersRes.data.data.users)
    } catch (error) {
      console.error('Failed to fetch dropdowns:', error)
    }
  }

  const filteredUsers = users.filter(u => {
    if (!userSearch) return true
    const search = userSearch.toLowerCase()
    return (
      u.firstName.toLowerCase().includes(search) ||
      u.lastName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.bookId || !formData.borrowerId || !formData.dueDate) {
      toast.error('Book, borrower, and due date are required')
      return
    }

    try {
      setLoading(true)
      await axiosInstance.post('/library/borrowings', {
        bookId: formData.bookId,
        borrowerId: formData.borrowerId,
        dueDate: formData.dueDate,
        finePerDay: Number(formData.finePerDay),
        notes: formData.notes.trim() || null,
      })
      toast.success('Book borrowed successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record borrowing')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Record Borrowing</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Book *</label>
            <select
              value={formData.bookId}
              onChange={e => setFormData({ ...formData, bookId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a book...</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Borrower *</label>
            <input
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-2"
            />
            <select
              value={formData.borrowerId}
              onChange={e => setFormData({ ...formData, borrowerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              size={4}
            >
              {filteredUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role}) — {u.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fine Per Day ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.finePerDay}
                onChange={e => setFormData({ ...formData, finePerDay: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Borrowing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BorrowModal
