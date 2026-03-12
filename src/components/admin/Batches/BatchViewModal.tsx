import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  BookOpen,
  Users,
  Info,
  Clock,
  Loader2,
  Hash,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface BatchViewModalProps {
  isOpen: boolean
  onClose: () => void
  batchId: string | null
}

const BatchViewModal: React.FC<BatchViewModalProps> = ({
  isOpen,
  onClose,
  batchId,
}) => {
  const [loading, setLoading] = useState(false)
  const [batch, setBatch] = useState<any>(null)

  useEffect(() => {
    if (isOpen && batchId) {
      fetchBatchDetails()
    }
  }, [isOpen, batchId])

  const fetchBatchDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/batches/${batchId}`)
      setBatch(response.data.data.batch)
    } catch (error: any) {
      toast.error('Failed to fetch batch details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Batch Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : batch ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b dark:border-gray-700">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <Calendar className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {batch.batchNumber}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {batch.program?.programName} ({batch.program?.programCode})
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {formatDate(batch.startDate)} - {batch.endDate ? formatDate(batch.endDate) : 'Present'}
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
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Hash className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Batch Number</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{batch.batchNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{batch.program?.programName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Date Range</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(batch.startDate)} to {batch.endDate ? formatDate(batch.endDate) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Locations / Centers */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> Assigned Centers
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                      {batch.centers && batch.centers.length > 0 ? (
                        batch.centers.map((center: any) => (
                          <div key={center.id} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                            {center.centerName} ({center.branch})
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No centers assigned.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Batch Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Enrollments</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{batch.stats?.enrollmentCount || 0}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Active Students</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{batch.stats?.activeEnrollments || 0}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Schedules</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{batch.stats?.scheduleCount || 0}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Completed Sessions</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-300 mt-1">{batch.stats?.completedSchedules || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Related Data Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                   {/* Students List */}
                   <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary-600" />
                        Students
                      </h5>
                      {batch.enrollments && batch.enrollments.length > 0 ? (
                        <div className="space-y-3">
                          {batch.enrollments.slice(0, 5).map((e: any) => (
                            <div key={e.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  {e.student.user.firstName} {e.student.user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{e.student.studentId}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                e.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>{e.status}</span>
                            </div>
                          ))}
                          {batch.enrollments.length > 5 && (
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                              + {batch.enrollments.length - 5} more students
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No students enrolled.</p>
                      )}
                   </div>

                   {/* Recent Schedules */}
                   <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary-600" />
                        Recent Schedules
                      </h5>
                      {batch.schedules && batch.schedules.length > 0 ? (
                        <div className="space-y-3">
                          {batch.schedules.slice(0, 5).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">{s.module?.moduleName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(s.date)} • {s.startTime.substring(0, 5)}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                s.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>{s.status}</span>
                            </div>
                          ))}
                          {batch.schedules.length > 5 && (
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                              + {batch.schedules.length - 5} more schedules
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No schedules found.</p>
                      )}
                   </div>
                </div>

                {/* Audit Info */}
                <div className="pt-6 border-t dark:border-gray-700 flex justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {new Date(batch.createdAt).toLocaleString()}
                  </div>
                  {batch.updatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(batch.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No batch data found.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BatchViewModal
