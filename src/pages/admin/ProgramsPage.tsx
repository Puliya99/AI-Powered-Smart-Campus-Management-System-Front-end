import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  Calendar,
  FileText,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import ProgramModal from '../../components/admin/Programs/ProgramModal'
import ProgramViewModal from '../../components/admin/Programs/ProgramViewModal'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'

interface Program {
  id: string
  programCode: string
  programName: string
  duration: string
  programFee: number
  description: string
  stats?: {
    moduleCount: number
    enrollmentCount: number
  }
  createdAt: string
}

const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCenter, setSelectedCenter] = useState('')
  const [centers, setCenters] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalEnrollments: 0,
    totalModules: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchPrograms()
    fetchStats()
  }, [currentPage, searchTerm, selectedCenter])

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

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCenter && { centerId: selectedCenter }),
      })

      const response = await axiosInstance.get(`/programs?${params}`)
      setPrograms(response.data.data.programs)
      setTotalPages(response.data.data.pagination.pages)
    } catch (error: any) {
      toast.error('Failed to fetch programs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/programs/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return
    }

    try {
      await axiosInstance.delete(`/programs/${id}`)
      toast.success('Program deleted successfully')
      fetchPrograms()
      fetchStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete program')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetails = (program: Program) => {
    setSelectedProgram(program)
    setShowViewModal(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
            <p className="text-gray-600 mt-1">Manage academic programs</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Program
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold">{stats.totalPrograms}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalEnrollments}
                </p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalModules}
                </p>
              </div>
              <FileText className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by program name or code..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedCenter}
              onChange={(e) => {
                setSelectedCenter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Centers</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.centerName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No programs found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Program Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
                          <span className="text-sm font-medium text-primary-600">
                            {program.programCode}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {program.programName}
                        </h3>
                      </div>
                    </div>

                    {/* Program Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Duration: {program.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>Fee: {formatCurrency(program.programFee)}</span>
                      </div>
                    </div>

                    {/* Program Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Modules</p>
                        <p className="text-lg font-bold text-blue-600">
                          {program.stats?.moduleCount || 0}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">Students</p>
                        <p className="text-lg font-bold text-green-600">
                          {program.stats?.enrollmentCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {program.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {program.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewDetails(program)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProgram(program)
                          setShowAddModal(true)
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
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

      {/* Add/Edit Program Modal */}
      <ProgramModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedProgram(null)
        }}
        program={selectedProgram}
        onSuccess={() => {
          fetchPrograms()
          fetchStats()
        }}
      />

      {/* View Program Modal */}
      <ProgramViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedProgram(null)
        }}
        programId={selectedProgram?.id || null}
      />
    </DashboardLayout>
  )
}

export default ProgramsPage
