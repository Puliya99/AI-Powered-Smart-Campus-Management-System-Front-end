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
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'RESCHEDULED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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

          <div className="bg-white px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : schedule ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <Calendar className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {schedule.module?.moduleName}
                      </h2>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </div>
                    <p className="text-gray-500 font-medium">
                      {schedule.module?.moduleCode} • {schedule.batch?.batchNumber}
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1 text-primary-500" />
                        {formatDate(schedule.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
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
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Lecturer</p>
                          <p className="text-sm font-medium text-gray-900">
                            {schedule.lecturer?.user?.firstName} {schedule.lecturer?.user?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-900">
                            {schedule.lectureHall}, {schedule.center?.centerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Program</p>
                          <p className="text-sm font-medium text-gray-900">
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
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{schedule.stats?.totalStudents || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-medium">Present</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">{schedule.stats?.presentCount || 0}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="text-xs text-red-600 font-medium">Absent</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">{schedule.stats?.absentCount || 0}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-600 font-medium">Attendance Rate</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{schedule.stats?.attendanceRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Attendance Record
                  </h4>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    {schedule.attendances && schedule.attendances.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {schedule.attendances.map((attendance: any) => (
                            <tr key={attendance.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {attendance.student?.user?.firstName} {attendance.student?.user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">{attendance.student?.studentId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  attendance.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                  attendance.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {attendance.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {attendance.remarks || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No attendance records found for this schedule.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Info */}
                <div className="pt-6 border-t flex justify-between text-xs text-gray-400">
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
                <p className="text-gray-500">No schedule data found.</p>
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

export default ScheduleViewModal
