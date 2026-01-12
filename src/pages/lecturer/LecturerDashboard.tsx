import React, { useEffect, useState } from 'react'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Award,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'

const LecturerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/lecturer')
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const stats = dashboardData?.stats || {}
  const upcomingClasses = dashboardData?.upcomingClasses || []
  const performance = dashboardData?.classPerformance || {}

  const statCards = [
    {
      name: 'Total Classes',
      value: stats.totalClasses || 0,
      icon: BookOpen,
      color: 'blue',
      change: 'Semester total',
    },
    {
      name: 'Today\'s Classes',
      value: stats.todayClasses || 0,
      icon: Calendar,
      color: 'green',
      change: 'Scheduled today',
    },
    {
      name: 'Total Students',
      value: stats.totalStudents || 0,
      icon: Users,
      color: 'purple',
      change: 'Across all modules',
    },
    {
      name: 'Pending Grading',
      value: stats.pendingGrading || 0,
      icon: ClipboardList,
      color: 'red',
      change: 'Assignments to grade',
    },
  ]

  const quickActions = [
    {
      name: 'Mark Attendance',
      href: '/lecturer/attendance',
      icon: CheckCircle,
      description: 'Record student attendance for today\'s classes',
    },
    {
      name: 'Upload Materials',
      href: '/lecturer/materials',
      icon: FileText,
      description: 'Share lecture notes and resources with students',
    },
    {
      name: 'Grade Assignments',
      href: '/lecturer/assignments',
      icon: Award,
      description: 'Review and grade student submissions',
    },
    {
      name: 'View Schedule',
      href: '/lecturer/schedule',
      icon: Calendar,
      description: 'Check your full teaching schedule',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {dashboardData?.profile?.name}! Here's your overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 bg-${stat.color}-100 rounded-md p-3`}
                  >
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-medium text-gray-400">
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Upcoming Classes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Upcoming Classes
              </h3>
              <Link to="/lecturer/schedule" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View All
              </Link>
            </div>
            <div className="p-5">
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 bg-primary-100 rounded-md p-2">
                        <Clock className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {item.module?.name}
                          </p>
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.batch?.name} | {item.location || 'Online'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No classes scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Class Performance
              </h3>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-3">
                    <Award className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{performance.average}%</p>
                  <p className="text-sm text-gray-500 mt-1">Average Student Performance</p>
                  <div className={`mt-2 flex items-center justify-center text-sm font-medium ${performance.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <span>Trend: {performance.trend === 'up' ? '↑ Increasing' : '↓ Decreasing'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="group p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-100 transition-colors">
                      <action.icon className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 ml-auto group-hover:text-primary-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{action.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LecturerDashboard
