import React, { useState, useEffect } from 'react'
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface AttendanceRecord {
  id: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  markedAt: string | null
  entryTime: string | null
  exitTime: string | null
  remarks: string | null
  student: {
    id: string
    universityNumber: string
    user: {
      firstName: string
      lastName: string
    }
  }
  schedule: {
    id: string
    date: string
    startTime: string
    endTime: string
    module: {
      moduleCode: string
      moduleName: string
    }
    batch: {
      batchNumber: string
    }
    center: {
      id: string
      centerCode: string
      centerName: string
    } | null
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  PRESENT: { color: 'text-green-700', bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" />, label: 'Present' },
  ABSENT: { color: 'text-red-700', bg: 'bg-red-100', icon: <XCircle className="w-4 h-4" />, label: 'Absent' },
  LATE: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <Clock className="w-4 h-4" />, label: 'Late' },
  EXCUSED: { color: 'text-blue-700', bg: 'bg-blue-100', icon: <AlertTriangle className="w-4 h-4" />, label: 'Excused' },
}

const StudentAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 0 })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    centerId: '',
  })
  const [centers, setCenters] = useState<{ id: string; centerCode: string; centerName: string }[]>([])

  useEffect(() => {
    fetchCenters()
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [pagination.page, filters])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchAttendance()
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      }
      if (search) params.search = search
      if (filters.startDate) params.startDate = filters.startDate
      if (filters.endDate) params.endDate = filters.endDate
      if (filters.status) params.status = filters.status
      if (filters.centerId) params.centerId = filters.centerId

      const res = await axiosInstance.get('/attendance', { params })
      const data = res.data.data
      setRecords(data.attendances || [])
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch {
      toast.error('Failed to fetch attendance records')
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const res = await axiosInstance.get('/centers/dropdown')
      setCenters(res.data.data?.centers || [])
    } catch {
      // Silently fail
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '-'
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ClipboardList className="w-7 h-7 text-blue-600" />
            Student Attendance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage attendance records for all students</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or module..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
              <select
                value={filters.centerId}
                onChange={e => setFilters(prev => ({ ...prev, centerId: e.target.value }))}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="">All Centers</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>{center.centerCode} - {center.centerName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Module</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Center</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Entry</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Exit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {records.map(record => {
                    const config = statusConfig[record.status] || statusConfig.ABSENT
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.student?.user?.firstName} {record.student?.user?.lastName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{record.student?.universityNumber}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                          {record.schedule?.date ? formatDate(record.schedule.date) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{record.schedule?.module?.moduleCode}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{record.schedule?.module?.moduleName}</div>
                        </td>
                        <td className="px-4 py-3">
                          {record.schedule?.center ? (
                            <>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{record.schedule.center.centerCode}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{record.schedule.center.centerName}</div>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {record.schedule?.startTime} - {record.schedule?.endTime}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {record.entryTime ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <LogIn className="w-3.5 h-3.5" />
                              {formatTime(record.entryTime)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {record.exitTime ? (
                            <span className="inline-flex items-center gap-1 text-blue-600">
                              <LogOut className="w-3.5 h-3.5" />
                              {formatTime(record.exitTime)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                            {config.icon}
                            {config.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                          {record.remarks || '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentAttendancePage
