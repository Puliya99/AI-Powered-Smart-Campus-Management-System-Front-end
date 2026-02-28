import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/api/axios.config'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  GraduationCap,
  FileText,
  ClipboardList,
  Video,
  Layout,
  BarChart2,
  Filter,
} from 'lucide-react'
import CalendarView from '../../components/student/Schedule/CalendarView'

interface Module {
  id: string
  moduleCode: string
  moduleName: string
  semesterNumber: number
  credits: number
  description: string
  program: {
    programCode: string
    programName: string
  }
  schedules: Array<{
    id: string
    date: string
    startTime: string
    endTime: string
    lectureHall: string
    batch: {
      batchNumber: string
    }
  }>
  assignments: Array<{
    id: string
    title: string
    dueDate: string
  }>
}

const ModuleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [module, setModule] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axiosInstance.get(`/modules/${id}`)
        setModule(response.data.data.module)
        setLoading(false)
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Failed to fetch module details'
        )
        setLoading(false)
      }
    }

    if (id) {
      fetchModuleDetails()
    }
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !module) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error || 'Module not found'}</p>
          </div>
          <Link
            to="/lecturer/classes"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Classes
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              to="/lecturer/classes"
              className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to My Classes
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {module.moduleName}
            </h1>
            <p className="text-gray-500">
              {module.moduleCode} • Semester {module.semesterNumber} •{' '}
              {module.credits} Credits
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Module Info & Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                  Module Overview
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {module.description ||
                      'No description available for this module.'}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-8 w-8 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Program
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {module.program.programName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-8 w-8 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Enrolled Batches
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {[
                          ...new Set(
                            module.schedules.map((s) => s.batch.batchNumber)
                          ),
                        ].join(', ') || 'No batches assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedules */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                  Schedules
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {module.schedules.length > 0 ? (
                        module.schedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(schedule.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {schedule.batch.batchNumber}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {schedule.lectureHall}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  (schedule as any).type === 'ONLINE'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {(schedule as any).type || 'PHYSICAL'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-4 text-center text-sm text-gray-500"
                          >
                            No upcoming schedules found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Recent Materials */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    to={`/lecturer/modules/${id}/materials`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    Lecture Materials
                  </Link>
                  <Link
                    to={`/lecturer/modules/${id}/quizzes`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Layout className="h-5 w-5 mr-3" />
                    Online Quizzes
                  </Link>
                  <Link
                    to={`/lecturer/modules/${id}/assignments`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <ClipboardList className="h-5 w-5 mr-3" />
                    Assignments
                  </Link>
                  <Link
                    to={`/lecturer/modules/${id}/assignments/create`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <ClipboardList className="h-5 w-5 mr-3" />
                    Create Assignment
                  </Link>
                  <Link
                    to={`/lecturer/modules/${id}/results`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <GraduationCap className="h-5 w-5 mr-3" />
                    Manage Results
                  </Link>
                  <Link
                    to={`/lecturer/performance?moduleId=${id}`}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <BarChart2 className="h-5 w-5 mr-3" />
                    Module Performance
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        const title = `Online Lecture: ${
                          module.moduleName
                        } - ${new Date().toLocaleDateString()}`
                        const response = await axiosInstance.post(
                          '/video-meetings',
                          {
                            title,
                            moduleId: id,
                          }
                        )
                        navigate(
                          `/video/room/${response.data.data.meeting.meetingCode}`
                        )
                      } catch (error) {
                        console.error('Failed to start online lecture:', error)
                      }
                    }}
                    className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <Video className="h-5 w-5 mr-3" />
                    Start Online Lecture
                  </button>
                  <button className="flex items-center justify-start w-full px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                    <Users className="h-5 w-5 mr-3" />
                    Mark Attendance
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Assignments
                </h2>
                <div className="space-y-4">
                  {module.assignments.length > 0 ? (
                    module.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Due:{' '}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No assignments created yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CalendarView
            events={[
              ...module.schedules.map((s) => ({
                id: s.id,
                date: s.date,
                title: `${module.moduleName} (${s.batch.batchNumber})`,
                type: 'class' as const,
                moduleCode: module.moduleCode,
                time: `${s.startTime.substring(0, 5)} - ${s.endTime.substring(
                  0,
                  5
                )}`,
              })),
              ...module.assignments.map((a) => ({
                id: a.id,
                date: a.dueDate,
                title: `Due: ${a.title}`,
                type: 'assignment' as const,
                moduleCode: module.moduleCode,
              })),
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default ModuleDetailsPage
