import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface BatchModalProps {
  isOpen: boolean
  onClose: () => void
  batch?: any | null
  onSuccess: () => void
}

interface FormData {
  batchNumber: string
  startDate: string
  endDate: string
  programId: string
  status: string
}

interface Program {
  id: string
  programCode: string
  programName: string
}

const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  batch,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [formData, setFormData] = useState<FormData>({
    batchNumber: '',
    startDate: '',
    endDate: '',
    programId: '',
    status: 'UPCOMING',
  })

  useEffect(() => {
    if (isOpen) {
      fetchPrograms()
    }
  }, [isOpen])

  useEffect(() => {
    if (batch) {
      setFormData({
        batchNumber: batch.batchNumber || '',
        startDate: batch.startDate?.split('T')[0] || '',
        endDate: batch.endDate?.split('T')[0] || '',
        programId: batch.program?.id || '',
        status: batch.status || 'UPCOMING',
      })
    } else {
      // Generate default batch number
      const year = new Date().getFullYear()
      const month = String(new Date().getMonth() + 1).padStart(2, '0')
      setFormData({
        batchNumber: `BATCH_${year}_${month}`,
        startDate: '',
        endDate: '',
        programId: '',
        status: 'UPCOMING',
      })
    }
  }, [batch])

  const fetchPrograms = async () => {
    try {
      setLoadingData(true)
      const response = await axiosInstance.get('/programs/dropdown')
      setPrograms(response.data.data.programs)
    } catch (error) {
      console.error('Failed to fetch programs:', error)
      toast.error('Failed to load programs')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.batchNumber.trim()) {
      toast.error('Batch number is required')
      return false
    }
    if (!formData.startDate) {
      toast.error('Start date is required')
      return false
    }
    if (!formData.programId) {
      toast.error('Please select a program')
      return false
    }
    if (
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      toast.error('End date must be after start date')
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
        endDate: formData.endDate || null,
      }

      if (batch) {
        await axiosInstance.put(`/batches/${batch.id}`, payload)
        toast.success('Batch updated successfully')
      } else {
        await axiosInstance.post('/batches', payload)
        toast.success('Batch created successfully')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${batch ? 'update' : 'create'} batch`
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
              {batch ? 'Edit Batch' : 'Add New Batch'}
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
              {loadingData ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <>
                  {/* Batch Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      required
                      disabled={!!batch}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="e.g., BATCH_2024_01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Unique identifier for the batch
                    </p>
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="programId"
                      value={formData.programId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.programCode} - {program.programName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Optional</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Once created, the batch number
                      cannot be changed. Students can be enrolled in this batch
                      after creation.
                    </p>
                  </div>
                </>
              )}
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
                disabled={loading || loadingData}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {batch ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {batch ? 'Update Batch' : 'Create Batch'}
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

export default BatchModal
