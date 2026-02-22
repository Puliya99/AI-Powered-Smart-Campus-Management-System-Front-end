import React, { useEffect, useState } from 'react'
import {
  BookOpen,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  Clock,
  CheckCircle,
  CreditCard,
  Video,
  Brain,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'
import RiskDetailsCard from '../../components/shared/AI/RiskDetailsCard'
import { useAuth } from '../../context/AuthContext'
import ChatBot from '../../components/common/ChatBot/ChatBot'

const StudentDashboard: React.FC = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const studentId = (user as any)?.studentId
    if (studentId) {
      fetchPredictions(studentId)
    }
  }, [user])

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

  const fetchPredictions = async (studentId?: string | number) => {
    if (!studentId) return
    try {
      const response = await axiosInstance.get(
        `/ai/predictions/student/${studentId}`,
      )
      setPredictions(response.data.data)
    } catch (error) {
      console.error('Failed to fetch predictions:', error)
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
  const upcomingClasses = dashboardData?.upcomingClasses || []
  const recentResults = dashboardData?.recentResults || []

  const statCards = [
    {
      name: 'Enrolled Courses',
      value: stats.enrolledCourses || 0,
      icon: BookOpen,
      color: 'blue',
    },
    {
      name: 'Attendance Rate',
      value: `${stats.attendanceRate || 0}%`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Pending Assignments',
      value: stats.pendingAssignments || 0,
      icon: FileText,
      color: 'purple',
    },
    {
      name: 'Average Grade',
      value: stats.averageGrade || 0,
      icon: Award,
      color: 'yellow',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back,{' '}
            {dashboardData?.profile?.nameWithInitials ||
              dashboardData?.profile?.name}
            ! Track your academic progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white p-5 shadow rounded-lg">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Performance Insights - NEW for Student */}
        {predictions.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    AI Study Recommendations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Personalized insights based on your recent activity
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </div>
            </div>

            <div className="mt-2">
              <RiskDetailsCard
                reasons={[]} // Don't show raw reasons to students as per requirement "DO NOT show raw score"
                recommendation={predictions[0].recommendation}
                showReasons={false}
              />
              <p className="mt-3 text-xs text-gray-400 italic">
                Last updated:{' '}
                {new Date(predictions[0].createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Upcoming Classes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Upcoming Classes
              </h3>
              <Link
                to="/student/schedule"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View Schedule
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
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.module?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.startTime} - {item.endTime}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {item.location || 'Online'} | {item.type || 'PHYSICAL'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No upcoming classes today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Results
              </h3>
              <Link
                to="/student/results"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View All
              </Link>
            </div>
            <div className="p-5">
              {recentResults.length > 0 ? (
                <div className="space-y-4">
                  {recentResults.map((result: any) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {result.module?.name}
                        </p>
                        <p className="text-xs text-gray-500">{result.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {result.marks}/{result.maxMarks}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round((result.marks / result.maxMarks) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No recent results found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="text-lg font-medium mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/student/assignments"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Assignments</span>
            </Link>
            <Link
              to="/student/payments"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CreditCard className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Payments</span>
            </Link>
            <Link
              to="/student/courses"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Courses</span>
            </Link>
            <Link
              to="/student/online-classes"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Video className="h-6 w-6 text-red-600 mb-2" />
              <span className="text-sm font-medium">Online Classes</span>
            </Link>
            <Link
              to="/student/results"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Award className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm font-medium">Results</span>
            </Link>
          </div>
        </div>
      </div>
      {/* RAG Chatbot */}
      <ChatBot courseId={dashboardData?.upcomingClasses?.[0]?.module?.id} />
    </DashboardLayout>
  )
}

export default StudentDashboard
