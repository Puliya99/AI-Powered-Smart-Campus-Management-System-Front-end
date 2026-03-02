import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
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
}

interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  book?: Book | null
  onSuccess: () => void
}

const CATEGORIES = [
  { value: 'TEXTBOOK', label: 'Textbook' },
  { value: 'REFERENCE', label: 'Reference' },
  { value: 'JOURNAL', label: 'Journal' },
  { value: 'MAGAZINE', label: 'Magazine' },
  { value: 'FICTION', label: 'Fiction' },
  { value: 'NON_FICTION', label: 'Non-Fiction' },
  { value: 'RESEARCH_PAPER', label: 'Research Paper' },
  { value: 'OTHER', label: 'Other' },
]

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, book, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'OTHER',
    totalCopies: '1',
    shelfLocation: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        category: book.category,
        totalCopies: String(book.totalCopies),
        shelfLocation: book.shelfLocation || '',
      })
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'OTHER',
        totalCopies: '1',
        shelfLocation: '',
      })
    }
  }, [book, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error('Title and author are required')
      return
    }

    try {
      setLoading(true)
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || null,
        category: formData.category,
        totalCopies: Number(formData.totalCopies),
        shelfLocation: formData.shelfLocation.trim() || null,
      }

      if (book) {
        await axiosInstance.put(`/library/books/${book.id}`, payload)
        toast.success('Book updated successfully')
      } else {
        await axiosInstance.post('/library/books', payload)
        toast.success('Book added successfully')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save book')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={e => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter ISBN (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
              <input
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={e => setFormData({ ...formData, totalCopies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Location</label>
              <input
                type="text"
                value={formData.shelfLocation}
                onChange={e => setFormData({ ...formData, shelfLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., A-3-12"
              />
            </div>
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
              {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookModal
