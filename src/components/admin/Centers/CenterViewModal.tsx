import React, { useState, useEffect } from 'react'
import {
  X,
  Building2,
  Users,
  User,
  Calendar,
  MapPin,
  Phone,
  Hash,
  Loader2,
  Info,
  Clock
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface CenterViewModalProps {
  isOpen: boolean
  onClose: () => void
  centerId: string | null
}

const CenterViewModal: React.FC<CenterViewModalProps> = ({
  isOpen,
  onClose,
  centerId,
}) => {
  const [loading, setLoading] = useState(false)
  const [center, setCenter] = useState<any>(null)

  useEffect(() => {
    if (isOpen && centerId) {
      fetchCenterDetails()
    }
  }, [isOpen, centerId])

  const fetchCenterDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/centers/${centerId}`)
      setCenter(response.data.data.center)
    } catch (error: any) {
      toast.error('Failed to fetch center details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Calculate statistics (use stats from backend if available, fallback to client-side calculation)
  const studentsCount = center?.stats?.studentCount ?? center?.users?.filter((u: any) => u.role === 'STUDENT').length ?? 0
  const staffCount = center?.stats?.userCount ?? center?.users?.filter((u: any) => u.role === 'ADMIN' || u.role === 'USER').length ?? 0
  const lecturersCount = center?.stats?.lecturerCount ?? center?.users?.filter((u: any) => u.role === 'LECTURER').length ?? 0
  const schedulesCount = center?.stats?.scheduleCount ?? center?.schedules?.length ?? 0

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Center Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : center ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <Building2 className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {center.centerName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {center.centerCode}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {center.branch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <Info className="w-4 h-4 mr-2" /> General Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Hash className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Center Code</p>
                          <p className="text-sm font-medium text-gray-900">{center.centerCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Building2 className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Center Name</p>
                          <p className="text-sm font-medium text-gray-900">{center.centerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Branch</p>
                          <p className="text-sm font-medium text-gray-900">{center.branch}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <Phone className="w-4 h-4 mr-2" /> Contact & Location
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{center.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="text-sm font-medium text-gray-900">{center.address || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Created At</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(center.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Center Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium">Total Staff</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{staffCount}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-xs text-green-600 font-medium">Total Students</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">{studentsCount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium">Total Lecturers</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">{lecturersCount}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-600 font-medium">Total Schedules</p>
                      <p className="text-2xl font-bold text-orange-900 mt-1">{schedulesCount}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Lists (Optional, just showing counts if they are empty) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 mb-3">Recently Added Users</h5>
                      {center.users && center.users.length > 0 ? (
                        <div className="space-y-3">
                          {center.users.slice(0, 5).map((u: any) => (
                            <div key={u.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-2">
                                  {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-700">{u.firstName} {u.lastName}</span>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{u.role}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No users found.</p>
                      )}
                   </div>
                   <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 mb-3">Active Schedules</h5>
                      {center.schedules && center.schedules.length > 0 ? (
                        <div className="space-y-3">
                          {center.schedules.slice(0, 5).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{s.date} ({s.startTime} - {s.endTime})</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>{s.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No schedules found.</p>
                      )}
                   </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No center data found.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CenterViewModal
