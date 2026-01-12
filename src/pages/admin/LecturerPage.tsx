import React, { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  BookOpen,
  Award,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import LecturerModal from '../../components/admin/Lecturer/LecturerModal'
import LecturerViewModal from '../../components/admin/Lecturer/LecturerViewModal'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface Lecturer {
  id: string
  specialization: string
  qualification: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    mobileNumber: string
    registrationNumber: string
    isActive: boolean
    createdAt: string
  }
  stats?: {
    moduleCount: number
    scheduleCount: number
  }
}

const LecturersPage: React.FC = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(
    null
  )
  const [stats, setStats] = useState({
    totalLecturers: 0,
    activeLecturers: 0,
    lecturersWithModules: 0,
    totalModulesAssigned: 0,
  })
  const [filters, setFilters] = useState({
    isActive: '',
    specialization: '',
    centerId: '',
  })
  const [centers, setCenters] = useState<any[]>([])

  useEffect(() => {
    fetchLecturers()
    fetchStats()
  }, [currentPage, searchTerm, filters])

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/dropdown')
      setCenters(response.data.data.centers)
    } catch (error) {
      console.error('Failed to fetch centers', error)
    }
  }

  const fetchLecturers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.isActive && { isActive: filters.isActive }),
        ...(filters.specialization && {
          specialization: filters.specialization,
        }),
        ...(filters.centerId && { centerId: filters.centerId }),
      })

      const response = await axiosInstance.get(`/lecturers?${params}`)
      setLecturers(response.data.data.lecturers)
      setTotalPages(response.data.data.pagination.pages)
    } catch (error: any) {
      toast.error('Failed to fetch lecturers')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/lecturers/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this lecturer?')) {
      return
    }

    try {
      await axiosInstance.delete(`/lecturers/${id}`)
      toast.success('Lecturer deactivated successfully')
      fetchLecturers()
      fetchStats()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to deactivate lecturer'
      )
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setCurrentPage(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturers</h1>
            <p className="text-gray-600 mt-1">Manage teaching staff</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Lecturer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lecturers</p>
                <p className="text-2xl font-bold">{stats.totalLecturers}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeLecturers}
                </p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Modules</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.lecturersWithModules}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modules Assigned</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalModulesAssigned}
                </p>
              </div>
              <Award className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lecturers..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Center Filter */}
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

            {/* Status Filter */}
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Specialization Filter */}
            <input
              type="text"
              placeholder="Filter by specialization..."
              value={filters.specialization}
              onChange={(e) =>
                handleFilterChange('specialization', e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Lecturers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : lecturers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No lecturers found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lecturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modules
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lecturers.map((lecturer) => (
                      <tr key={lecturer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {lecturer.user.firstName.charAt(0)}
                              {lecturer.user.lastName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {lecturer.user.firstName}{' '}
                                {lecturer.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lecturer.user.registrationNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {lecturer.user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {lecturer.user.mobileNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {lecturer.specialization || 'Not specified'}
                          </div>
                          {lecturer.qualification && (
                            <div className="text-sm text-gray-500">
                              {lecturer.qualification}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {lecturer.stats?.moduleCount || 0} Modules
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              lecturer.user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {lecturer.user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedLecturer(lecturer)
                                setShowViewModal(true)
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="View"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLecturer(lecturer)
                                setShowAddModal(true)
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(lecturer.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
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
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
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

      {/* Add/Edit Lecturer Modal */}
      <LecturerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedLecturer(null)
        }}
        lecturer={selectedLecturer}
        onSuccess={() => {
          fetchLecturers()
          fetchStats()
        }}
      />
      {/* View Lecturer Modal */}
      <LecturerViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedLecturer(null)
        }}
        lecturerId={selectedLecturer?.id || null}
      />
    </DashboardLayout>
  )
}

export default LecturersPage
