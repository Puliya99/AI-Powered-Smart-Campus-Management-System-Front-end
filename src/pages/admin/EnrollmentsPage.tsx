import React, { useState, useEffect } from 'react'
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface Enrollment {
  id: string
  enrollmentDate: string
  status: string
  student: {
    id: string
    universityNumber: string
    user: {
      firstName: string
      lastName: string
    }
  }
  program: {
    id: string
    programName: string
    programCode: string
  }
  batch: {
    id: string
    batchNumber: string
  }
}

const EnrollmentsPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    programId: '',
    batchId: '',
  })
  const [programs, setPrograms] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])

  useEffect(() => {
    fetchEnrollments()
  }, [currentPage, searchTerm, filters])

  useEffect(() => {
    fetchFilterData()
  }, [])

  const fetchFilterData = async () => {
    try {
      const [programsRes, batchesRes] = await Promise.all([
        axiosInstance.get('/programs/dropdown'),
        axiosInstance.get('/batches/dropdown'),
      ])
      setPrograms(programsRes.data.data.programs || [])
      setBatches(batchesRes.data.data.batches || [])
    } catch (error) {
      console.error('Failed to fetch filter data', error)
    }
  }

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.programId && { programId: filters.programId }),
        ...(filters.batchId && { batchId: filters.batchId }),
      })

      const response = await axiosInstance.get(`/enrollments?${params}`)
      setEnrollments(response.data.data.enrollments)
      setTotalPages(response.data.data.pagination.pages)
    } catch (error: any) {
      toast.error('Failed to fetch enrollments')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'WITHDRAWN':
        return 'bg-red-100 text-red-800'
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-indigo-600" />
              User Enrollments
            </h1>
            <p className="text-gray-600">Manage student enrollments in programs and batches</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filters.programId}
              onChange={(e) => setFilters({ ...filters, programId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.programName}
                </option>
              ))}
            </select>

            <select
              value={filters.batchId}
              onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batchNumber}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="WITHDRAWN">Withdrawn</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Program</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Batch</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Enrollment Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No enrollments found
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                            {enrollment.student.user.firstName[0]}
                            {enrollment.student.user.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {enrollment.student.user.firstName} {enrollment.student.user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{enrollment.student.universityNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{enrollment.program.programName}</div>
                        <div className="text-xs text-gray-500">{enrollment.program.programCode}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {enrollment.batch.batchNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(enrollment.enrollmentDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EnrollmentsPage
