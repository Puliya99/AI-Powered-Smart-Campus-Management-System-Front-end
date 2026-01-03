import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface ProgramModalProps {
  isOpen: boolean
  onClose: () => void
  program?: any | null
  onSuccess: () => void
}

interface FormData {
  programCode: string
  programName: string
  duration: string
  programFee: string
  description: string
}

const ProgramModal: React.FC<ProgramModalProps> = ({
  isOpen,
  onClose,
  program,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    programCode: '',
    programName: '',
    duration: '',
    programFee: '',
    description: '',
  })

  useEffect(() => {
    if (program) {
      setFormData({
        programCode: program.programCode || '',
        programName: program.programName || '',
        duration: program.duration || '',
        programFee: program.programFee?.toString() || '',
        description: program.description || '',
      })
    } else {
      setFormData({
        programCode: '',
        programName: '',
        duration: '',
        programFee: '',
        description: '',
      })
    }
  }, [program])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.programCode.trim()) {
      toast.error('Program code is required')
      return false
    }
    if (!formData.programName.trim()) {
      toast.error('Program name is required')
      return false
    }
    if (!formData.duration.trim()) {
      toast.error('Duration is required')
      return false
    }
    if (!formData.programFee || parseFloat(formData.programFee) <= 0) {
      toast.error('Valid program fee is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        programFee: parseFloat(formData.programFee),
      }

      if (program) {
        await axiosInstance.put(`/programs/${program.id}`, payload)
        toast.success('Program updated successfully')
      } else {
        await axiosInstance.post('/programs', payload)
        toast.success('Program created successfully')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${program ? 'update' : 'create'} program`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {program ? 'Edit Program' : 'Add New Program'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-5 space-y-6">
              {/* Program Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="programCode"
                  value={formData.programCode}
                  onChange={handleChange}
                  required
                  disabled={!!program}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="e.g., BSC-CS-2024"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for the program
                </p>
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="4 years">4 years</option>
                  <option value="5 years">5 years</option>
                </select>
              </div>

              {/* Program Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Fee (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="programFee"
                  value={formData.programFee}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 5000.00"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter program description, objectives, and key features..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {program ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {program ? 'Update Program' : 'Create Program'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProgramModal
