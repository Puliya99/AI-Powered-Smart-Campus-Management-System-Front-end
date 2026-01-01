import React, { useEffect, useState } from 'react'
import { BookOpen, TrendingUp, Calendar, FileText } from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'

const StudentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/student')
      setDashboardData(response.data.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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

  const stats = dashboardData?.stats || {}

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Track your academic progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-5 shadow rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-semibold">
                  {stats.enrolledCourses || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 shadow rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-semibold">
                  {stats.attendanceRate || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 shadow rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Assignments</p>
                <p className="text-2xl font-semibold">
                  {stats.pendingAssignments || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 shadow rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Average Grade</p>
                <p className="text-2xl font-semibold">
                  {stats.averageGrade || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-lg font-medium mb-4">Upcoming Classes</h3>
            <p className="text-gray-500">No upcoming classes today</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-lg font-medium mb-4">Recent Results</h3>
            <p className="text-gray-500">No recent results</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard
