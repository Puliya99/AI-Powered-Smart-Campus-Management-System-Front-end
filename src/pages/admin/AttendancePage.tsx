import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  BarChart3,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import AttendanceModal from '../../components/admin/Attendance/AttendanceModal'
import AttendanceViewModal from '../../components/admin/Attendance/AttendanceViewModal'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface Schedule {
  id: string
  date: string
  startTime: string
  endTime: string
  lectureHall: string
  status: string
  module: {
    id: string
    moduleCode: string
    moduleName: string
  }
  batch: {
    id: string
    batchNumber: string
  }
  lecturer: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  }
  stats?: {
    attendanceCount: number
  }
}

const AttendancePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  )
  const [centers, setCenters] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    attendanceRate: '0',
  })
  const [filters, setFilters] = useState({
    status: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    centerId: '',
  })

  useEffect(() => {
    fetchSchedules()
    fetchStats()
  }, [currentPage, searchTerm, filters])

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers')
      setCenters(response.data.data.centers || [])
    } catch (error) {
      console.error('Failed to fetch centers:', error)
    }
  }

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.centerId && { centerId: filters.centerId }),
      })

      const response = await axiosInstance.get(`/schedules?${params}`)
      setSchedules(response.data.data.schedules)
      setTotalPages(response.data.data.pagination.pages)
    } catch (error: any) {
      toast.error('Failed to fetch schedules')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/attendance/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleMarkAttendance = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setShowAttendanceModal(true)
  }

  const handleViewAttendance = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setShowViewModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setCurrentPage(1)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance Management
            </h1>
            <p className="text-gray-600 mt-1">
              Mark and manage student attendance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.presentCount}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.absentCount}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.attendanceRate}%
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by module or batch..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filters.centerId}
              onChange={(e) => handleFilterChange('centerId', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Centers</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.centerName}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No schedules found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {schedule.module.moduleCode}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            schedule.status
                          )}`}
                        >
                          {schedule.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {schedule.module.moduleName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {schedule.batch.batchNumber}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(schedule.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {formatTime(schedule.startTime)} -{' '}
                          {formatTime(schedule.endTime)}
                        </span>
                      </div>
                    </div>

                    {schedule.stats && schedule.stats.attendanceCount > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600">Attendance</p>
                        <p className="text-lg font-bold text-blue-600">
                          {schedule.stats.attendanceCount} Marked
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleMarkAttendance(schedule)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Mark
                      </button>
                      <button
                        onClick={() => handleViewAttendance(schedule)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && selectedSchedule && (
        <AttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => {
            setShowAttendanceModal(false)
            setSelectedSchedule(null)
          }}
          schedule={selectedSchedule}
          onSuccess={() => {
            fetchSchedules()
            fetchStats()
          }}
        />
      )}

      {/* View Attendance Modal */}
      <AttendanceViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedSchedule(null)
        }}
        scheduleId={selectedSchedule?.id || null}
      />
    </DashboardLayout>
  )
}

export default AttendancePage
