import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Info,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hash,
  Users,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface ScheduleViewModalProps {
  isOpen: boolean
  onClose: () => void
  scheduleId: string | null
}

const ScheduleViewModal: React.FC<ScheduleViewModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
}) => {
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState<any>(null)

  useEffect(() => {
    if (isOpen && scheduleId) {
      fetchScheduleDetails()
    }
  }, [isOpen, scheduleId])

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/schedules/${scheduleId}`)
      setSchedule(response.data.data.schedule)
    } catch (error: any) {
      toast.error('Failed to fetch schedule details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    return time.substring(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':   return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'COMPLETED':   return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'CANCELLED':   return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'RESCHEDULED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ONLINE':   return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'PHYSICAL': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      default:         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
            <h3 className="text-xl font-semibold text-white">Schedule Details</h3>
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
            ) : schedule ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b dark:border-gray-700">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Calendar className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {schedule.module?.moduleName || schedule.title || 'Schedule'}
                      </h2>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(schedule.type)}`}>
                        {schedule.type || 'PHYSICAL'}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {schedule.module?.moduleCode} {schedule.module?.moduleCode && schedule.batch?.batchNumber ? '•' : ''} {schedule.batch?.batchNumber}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1 text-primary-500" />
                        {formatDate(schedule.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1 text-primary-500" />
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <Info className="w-4 h-4 mr-2" /> Class Information
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Lecturer</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {schedule.lecturer?.user?.firstName} {schedule.lecturer?.user?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {schedule.lectureHall}, {schedule.center?.centerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {schedule.module?.program?.programName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Statistics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Attendance Overview
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{schedule.stats?.totalStudents || 0}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">Present</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{schedule.stats?.presentCount || 0}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">Absent</p>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-1">{schedule.stats?.absentCount || 0}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Attendance Rate</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{schedule.stats?.attendanceRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Attendance Record
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {schedule.attendances && schedule.attendances.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {schedule.attendances.map((attendance: any) => (
                            <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {attendance.student?.user?.firstName} {attendance.student?.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{attendance.student?.studentId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  attendance.status === 'PRESENT' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  attendance.status === 'ABSENT' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {attendance.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {attendance.remarks || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No attendance records found for this schedule.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Info */}
                <div className="pt-6 border-t dark:border-gray-700 flex justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {new Date(schedule.createdAt).toLocaleString()}
                  </div>
                  {schedule.updatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(schedule.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No schedule data found.</p>
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

export default ScheduleViewModal
