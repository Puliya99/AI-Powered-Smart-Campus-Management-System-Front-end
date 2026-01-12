import React, { useEffect, useState } from 'react'
import { 
  Users, 
  ClipboardList, 
  FileText, 
  Calendar,
  UserPlus,
  Settings,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'

const StaffDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/staff')
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
  const recentRegistrations = dashboardData?.recentRegistrations || []
  const upcomingEvents = dashboardData?.upcomingEvents || []

  const statCards = [
    {
      name: 'Today\'s Enrollments',
      value: stats.todayEnrollments || 0,
      icon: UserPlus,
      color: 'blue',
    },
    {
      name: 'Pending Documents',
      value: stats.pendingDocuments || 0,
      icon: FileText,
      color: 'yellow',
    },
    {
      name: 'Total Registrations',
      value: stats.totalRegistrations || 0,
      icon: Users,
      color: 'green',
    },
    {
      name: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'purple',
    },
  ]

  const quickActions = [
    {
      name: 'New Enrollment',
      href: '/user/enrollment',
      icon: UserPlus,
      color: 'bg-blue-500',
    },
    {
      name: 'Student List',
      href: '/user/students',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Verify Documents',
      href: '/user/documents',
      icon: ClipboardList,
      color: 'bg-purple-500',
    },
    {
      name: 'Generate Reports',
      href: '/user/reports',
      icon: FileText,
      color: 'bg-orange-500',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {dashboardData?.profile?.name}! Manage campus operations efficiently.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
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
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`${action.color} p-3 rounded-lg mr-4`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-gray-900">{action.name}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Registrations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Student Registrations
              </h3>
              <Link to="/user/students" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            <div className="p-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentRegistrations.length > 0 ? (
                    recentRegistrations.map((student: any) => (
                      <li key={student.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-700 font-medium">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {student.registrationNumber || 'New'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="py-4 text-center text-gray-500 text-sm">No recent registrations.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Upcoming Events/Schedules */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Upcoming Classes
              </h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any) => (
                    <div key={event.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 pt-0.5">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.module?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {event.batch?.name} | {event.startTime} - {event.endTime}
                        </p>
                      </div>
                      <Link to={`/user/schedules/${event.id}`} className="ml-4 flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-4">No upcoming events today.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StaffDashboard
