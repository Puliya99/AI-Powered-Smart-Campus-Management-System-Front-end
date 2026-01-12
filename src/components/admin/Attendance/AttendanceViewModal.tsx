import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Info,
  Hash,
  BookOpen,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface AttendanceViewModalProps {
  isOpen: boolean
  onClose: () => void
  scheduleId: string | null
}

const AttendanceViewModal: React.FC<AttendanceViewModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
}) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && scheduleId) {
      fetchAttendanceDetails()
    }
  }, [isOpen, scheduleId])

  const fetchAttendanceDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/attendance/schedule/${scheduleId}`)
      setData(response.data.data)
    } catch (error: any) {
      toast.error('Failed to fetch attendance details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Present
          </span>
        )
      case 'ABSENT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Absent
          </span>
        )
      case 'LATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Late
          </span>
        )
      case 'EXCUSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Info className="w-3 h-3 mr-1" /> Excused
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Unmarked
          </span>
        )
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
            <h3 className="text-xl font-semibold text-white">Attendance Details</h3>
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
            ) : data ? (
              <div className="space-y-8">
                {/* Schedule Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {data.schedule.module.moduleName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {data.schedule.module.moduleCode} • {data.schedule.batch.batchNumber}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {formatDate(data.schedule.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {formatTime(data.schedule.startTime)} - {formatTime(data.schedule.endTime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium uppercase">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{data.stats.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Present</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{data.stats.present}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-xs text-red-600 font-medium uppercase tracking-wider">Absent</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">{data.stats.absent}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-xs text-yellow-600 font-medium uppercase tracking-wider">Late</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">{data.stats.late}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {data.stats.total > 0 ? ((data.stats.present / data.stats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                {/* Student Attendance Table */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Student Attendance List
                  </h4>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID / Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.students.map((record: any) => (
                          <tr key={record.student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {record.student.user.firstName} {record.student.user.lastName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{record.student.studentCode}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(record.attendance?.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 italic">
                                {record.attendance?.remarks || '-'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No attendance data found.</p>
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

export default AttendanceViewModal
