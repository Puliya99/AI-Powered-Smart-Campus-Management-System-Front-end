import React, { useState, useEffect } from 'react'
import { X, Save, Loader2, Building2, MapPin, Phone } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface CenterModalProps {
  isOpen: boolean
  onClose: () => void
  center?: any | null
  onSuccess: () => void
}

interface FormData {
  centerCode: string
  centerName: string
  branch: string
  address: string
  phone: string
}

const CenterModal: React.FC<CenterModalProps> = ({
  isOpen,
  onClose,
  center,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    centerCode: '',
    centerName: '',
    branch: '',
    address: '',
    phone: '',
  })

  useEffect(() => {
    if (center) {
      setFormData({
        centerCode: center.centerCode || '',
        centerName: center.centerName || '',
        branch: center.branch || '',
        address: center.address || '',
        phone: center.phone || '',
      })
    } else {
      setFormData({
        centerCode: '',
        centerName: '',
        branch: '',
        address: '',
        phone: '',
      })
    }
  }, [center])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.centerCode.trim()) {
      toast.error('Center code is required')
      return false
    }
    if (!formData.centerName.trim()) {
      toast.error('Center name is required')
      return false
    }
    if (!formData.branch.trim()) {
      toast.error('Branch/location is required')
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
      if (center) {
        await axiosInstance.put(`/centers/${center.id}`, formData)
        toast.success('Center updated successfully')
      } else {
        await axiosInstance.post('/centers', formData)
        toast.success('Center created successfully')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${center ? 'update' : 'create'} center`
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
              {center ? 'Edit Center' : 'Add New Center'}
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
              {/* Center Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="centerCode"
                  value={formData.centerCode}
                  onChange={handleChange}
                  required
                  disabled={!!center}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="e.g., CMB001"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for the center
                </p>
              </div>

              {/* Center Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="centerName"
                    value={formData.centerName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Colombo Main Campus"
                  />
                </div>
              </div>

              {/* Branch/Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch/Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Colombo, Kandy, Galle"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Full address of the center"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 0112345678"
                  />
                </div>
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
                    {center ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {center ? 'Update Center' : 'Create Center'}
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

export default CenterModal
