import React, { useEffect, useState } from 'react'
import { BookOpen, Users, Calendar, Clock, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'

const LecturerClassesPage: React.FC = () => {
  const [lecturer, setLecturer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLecturerProfile()
  }, [])

  const fetchLecturerProfile = async () => {
    try {
      const response = await axiosInstance.get('/lecturers/profile/me')
      setLecturer(response.data.data.lecturer)
    } catch (error) {
      console.error('Failed to fetch lecturer profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const modules = lecturer?.modules || []
  const filteredModules = modules.filter((m: any) =>
    m.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.moduleCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Classes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your assigned modules and class schedules.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search modules..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.length > 0 ? (
            filteredModules.map((module: any) => (
              <div key={module.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {module.moduleCode}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{module.moduleName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{module.program?.name || 'No Program'}</p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{module.enrollmentCount || 0} Students Enrolled</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Semester {module.semesterNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{module.creditHours} Credits</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link
                      to={`/lecturer/attendance?moduleId=${module.id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Attendance
                    </Link>
                    <Link
                      to={`/lecturer/modules/${module.id}/results`}
                      className="text-sm font-medium text-rose-600 hover:text-rose-700"
                    >
                      Results
                    </Link>
                  </div>
                  <Link
                    to={`/lecturer/modules/${module.id}`}
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No modules found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You haven't been assigned any modules yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LecturerClassesPage
