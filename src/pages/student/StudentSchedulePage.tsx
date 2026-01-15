import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
} from 'lucide-react'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import axiosInstance from '../../services/api/axios.config'
import toast from 'react-hot-toast'
import CalendarView from '../../components/student/Schedule/CalendarView'

interface Schedule {
  id: string
  date: string
  startTime: string
  endTime: string
  lectureHall: string
  type: string
  status: string
  module: {
    id: string
    moduleCode: string
    moduleName: string
  }
  batch: {
    id: string
    batchNumber: string
  }
  lecturer: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  }
  center: {
    id: string
    centerName: string
  }
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  module: {
    moduleCode: string;
  };
}

const StudentSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [scheduleRes, assignmentRes] = await Promise.all([
        axiosInstance.get('/students/my-schedule'),
        axiosInstance.get('/assignments/student/my-assignments')
      ]);
      setSchedules(scheduleRes.data.data.schedules)
      setAssignments(assignmentRes.data.data.assignments)
    } catch (error: any) {
      toast.error('Failed to fetch data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5)
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isUpcoming = (dateString: string, startTime: string) => {
    const now = new Date()
    const scheduleDate = new Date(dateString)
    const [hours, minutes] = startTime.split(':').map(Number)
    scheduleDate.setHours(hours, minutes, 0, 0)
    return scheduleDate > now
  }

  // Group schedules by date
  const groupedSchedules = schedules.reduce((groups: any, schedule) => {
    const date = schedule.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(schedule)
    return groups
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedSchedules).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  // Filter for upcoming sessions
  const upcomingDates = sortedDates.filter(date => {
      const today = new Date();
      today.setHours(0,0,0,0);
      return new Date(date) >= today;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-600 mt-1">
              View your upcoming classes and academic sessions.
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : view === 'list' ? (
          <div className="space-y-8">
            {upcomingDates.length > 0 ? (
              upcomingDates.map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <h2 className={`text-lg font-bold px-4 py-1 rounded-full ${
                        isToday(date) ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isToday(date) ? 'Today' : formatDate(date)}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSchedules[date].map((schedule: Schedule) => (
                      <div
                        key={schedule.id}
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all ${
                            isToday(date) && isUpcoming(schedule.date, schedule.startTime) ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                schedule.type === 'ONLINE' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {schedule.type}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                            {schedule.module.moduleName}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {schedule.module.moduleCode} • {schedule.batch.batchNumber}
                          </p>

                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <span>
                                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{schedule.lectureHall} • {schedule.center.centerName}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <span>
                                {schedule.lecturer.user.firstName} {schedule.lecturer.user.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {schedule.type === 'ONLINE' && isUpcoming(schedule.date, schedule.startTime) && (
                            <div className="px-5 py-3 bg-purple-50 border-t border-purple-100">
                                <button className="w-full text-center text-sm font-bold text-purple-700 hover:text-purple-800">
                                    JOIN ONLINE CLASS
                                </button>
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No upcoming classes</h3>
                <p className="text-gray-500 mt-1">You have no classes scheduled for the upcoming days.</p>
              </div>
            )}
            
            {/* Past Classes Toggle/Section could be added here */}
          </div>
        ) : (
          <CalendarView 
            events={[
              ...schedules.map(s => ({
                id: s.id,
                date: s.date,
                title: s.module.moduleName,
                type: 'class' as const,
                moduleCode: s.module.moduleCode,
                time: `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`
              })),
              ...assignments.map(a => ({
                id: a.id,
                date: a.dueDate,
                title: `Due: ${a.title}`,
                type: 'assignment' as const,
                moduleCode: a.module.moduleCode
              }))
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentSchedulePage
