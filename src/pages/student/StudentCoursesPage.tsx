import React, { useEffect, useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  FileText,
  HelpCircle,
  ClipboardList,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'

const StudentCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')

  useEffect(() => {
    fetchEnrolledCourses()
  }, [semesterFilter])

  const fetchEnrolledCourses = async () => {
    try {
      const params = new URLSearchParams()
      if (semesterFilter) {
        params.append('semester', semesterFilter)
      }
      const response = await axiosInstance.get(`/students/my-courses?${params.toString()}`)
      setCourses(response.data.data.courses || [])
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const [activeMeetings, setActiveMeetings] = useState<Record<string, any[]>>(
    {}
  )

  useEffect(() => {
    if (courses.length > 0) {
      fetchActiveMeetings()
    }
  }, [courses])

  const fetchActiveMeetings = async () => {
    try {
      const meetingsPromises = courses.map((m: any) =>
        axiosInstance.get(`/video-meetings/module/${m.id}`)
      )

      const results = await Promise.all(meetingsPromises)
      const meetingsMap: Record<string, any[]> = {}

      courses.forEach((m: any, index: number) => {
        meetingsMap[m.id] = results[index].data.data.meetings
      })

      setActiveMeetings(meetingsMap)
    } catch (error) {
      console.error('Failed to fetch active meetings:', error)
    }
  }

  const filteredCourses = courses.filter(
    (c: any) =>
      c.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.moduleCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1">
              View and manage your enrolled modules and study materials.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num.toString()}>
                  Semester {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course: any) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.moduleCode}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {course.moduleName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Semester {course.semesterNumber}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {activeMeetings[course.id]?.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-100 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-green-700 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            LIVE NOW
                          </span>
                          <Link
                            to={`/video/room/${
                              activeMeetings[course.id][0].meetingCode
                            }`}
                            className="text-xs font-bold text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 transition"
                          >
                            JOIN
                          </Link>
                        </div>
                        <p className="text-xs text-green-800 font-medium truncate">
                          {activeMeetings[course.id][0].title}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{course.credits} Credits</span>
                    </div>
                    {course.lecturer && (
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{course.lecturer.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <Link
                      to={`/student/modules/${course.id}/materials`}
                      className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Materials
                    </Link>
                    <Link
                      to={`/student/modules/${course.id}/quizzes`}
                      className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Quizzes
                    </Link>
                    <Link
                      to={`/student/modules/${course.id}/assignments`}
                      className="flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Assignments
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 bg-white rounded-xl border-2 border-dashed border-gray-300 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No courses found
              </h3>
              <p className="text-gray-500 mt-1">
                You are not enrolled in any courses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentCoursesPage
