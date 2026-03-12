import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  User,
  Award,
  Filter,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import ModuleModal from '../../components/admin/Modules/ModuleModal';
import ModuleViewModal from '../../components/admin/Modules/ModuleViewModal';
import axiosInstance from '../../services/api/axios.config';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
  semesterNumber: number;
  credits: number;
  description: string;
  program: {
    id: string;
    programCode: string;
    programName: string;
  };
  lecturer?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
}

const ModulesPage: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [stats, setStats] = useState({
    totalModules: 0,
    modulesWithLecturer: 0,
    modulesWithoutLecturer: 0,
  });
  const [filters, setFilters] = useState({
    programId: '',
    semesterNumber: '',
    centerId: '',
  });
  const [programs, setPrograms] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);

  useEffect(() => {
    fetchModules();
    fetchStats();
  }, [currentPage, searchTerm, filters]);

  useEffect(() => {
    fetchPrograms();
    fetchCenters();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axiosInstance.get('/programs/dropdown');
      setPrograms(response.data.data.programs);
    } catch (error) {
      console.error('Failed to fetch programs', error);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/dropdown');
      setCenters(response.data.data.centers);
    } catch (error) {
      console.error('Failed to fetch centers', error);
    }
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.programId && { programId: filters.programId }),
        ...(filters.semesterNumber && { semesterNumber: filters.semesterNumber }),
        ...(filters.centerId && { centerId: filters.centerId }),
      });

      const response = await axiosInstance.get(`/modules?${params}`);
      setModules(response.data.data.modules);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error: any) {
      toast.error('Failed to fetch modules');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/modules/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this module?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/modules/${id}`);
      toast.success('Module deleted successfully');
      fetchModules();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete module');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modules</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage course modules</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Module
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Modules</p>
                <p className="text-2xl font-bold dark:text-white">{stats.totalModules}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">With Lecturer</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.modulesWithLecturer}
                </p>
              </div>
              <User className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unassigned</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.modulesWithoutLecturer}
                </p>
              </div>
              <User className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Program Filter */}
            <select
              value={filters.programId}
              onChange={(e) => handleFilterChange('programId', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.programName}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={filters.semesterNumber}
              onChange={(e) =>
                handleFilterChange('semesterNumber', e.target.value)
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            {/* Center Filter (Admin only) */}
            {user?.role === 'ADMIN' && (
              <select
                value={filters.centerId}
                onChange={(e) => handleFilterChange('centerId', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Centers</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.centerName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No modules found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow dark:bg-gray-800"
                  >
                    {/* Module Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                          {module.moduleCode}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Semester {module.semesterNumber}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {module.moduleName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {module.program.programName}
                      </p>
                    </div>

                    {/* Module Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Award className="w-4 h-4 mr-2" />
                        <span>Credits: {module.credits || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        <span>
                          {module.lecturer
                            ? `${module.lecturer.user.firstName} ${module.lecturer.user.lastName}`
                            : 'No Lecturer Assigned'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {module.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {module.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedModule(module)
                          setShowViewModal(true)
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedModule(module)
                          setShowAddModal(true)
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
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
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1 + Math.max(0, currentPage - 3)
                          if (pageNum > totalPages) return null
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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

      {/* Add/Edit Module Modal */}
      {showAddModal && (
        <ModuleModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setSelectedModule(null)
          }}
          onSuccess={() => {
            fetchModules()
            fetchStats()
          }}
          module={selectedModule}
        />
      )}
      {/* View Module Modal */}
      <ModuleViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedModule(null)
        }}
        moduleId={selectedModule?.id || null}
      />
    </DashboardLayout>
  )
}

export default ModulesPage
