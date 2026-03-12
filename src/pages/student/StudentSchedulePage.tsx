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
  Star,
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
  category?: string
  title?: string
  description?: string
  module: {
    id: string
    moduleCode: string
    moduleName: string
  } | null
  batch: {
    id: string
    batchNumber: string
  } | null
  lecturer: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  } | null
  center: {
    id: string
    centerName: string
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  CLASS: 'Class',
  SEMINAR: 'Seminar',
  WORKSHOP: 'Workshop',
  EXAM: 'Exam',
  SPORTS_DAY: 'Sports Day',
  GUEST_LECTURE: 'Guest Lecture',
  OTHER: 'Other',
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'SEMINAR': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    case 'WORKSHOP': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'EXAM': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'SPORTS_DAY': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'GUEST_LECTURE': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'OTHER': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
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
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View your upcoming classes, events, and academic sessions.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                      isToday(date)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {isToday(date) ? 'Today' : formatDate(date)}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSchedules[date].map((schedule: Schedule) => {
                      const isEvent = schedule.category && schedule.category !== 'CLASS';
                      return (
                        <div
                          key={schedule.id}
                          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all ${
                            isToday(date) && isUpcoming(schedule.date, schedule.startTime) ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                          }`}
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-2 rounded-lg ${isEvent ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
                                {isEvent ? (
                                  <Star className="h-6 w-6 text-emerald-600" />
                                ) : (
                                  <BookOpen className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isEvent && schedule.category && (
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(schedule.category)}`}>
                                    {CATEGORY_LABELS[schedule.category] || schedule.category}
                                  </span>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  schedule.type === 'ONLINE'
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {schedule.type}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {isEvent ? schedule.title : schedule.module?.moduleName || 'Untitled'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              {isEvent
                                ? schedule.description
                                  ? <span className="line-clamp-1">{schedule.description}</span>
                                  : schedule.module
                                    ? `${schedule.module.moduleCode}${schedule.batch ? ` • ${schedule.batch.batchNumber}` : ''}`
                                    : schedule.batch?.batchNumber || 'Event'
                                : `${schedule.module?.moduleCode || ''} • ${schedule.batch?.batchNumber || ''}`
                              }
                            </p>

                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                <span>
                                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{schedule.lectureHall} • {schedule.center.centerName}</span>
                              </div>
                              {schedule.lecturer && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>
                                    {schedule.lecturer.user.firstName} {schedule.lecturer.user.lastName}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {schedule.type === 'ONLINE' && isUpcoming(schedule.date, schedule.startTime) && (
                            <div className="px-5 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800">
                              <button className="w-full text-center text-sm font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                                JOIN ONLINE CLASS
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No upcoming schedules</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">You have no classes or events scheduled for the upcoming days.</p>
              </div>
            )}

            {/* Past Classes Toggle/Section could be added here */}
          </div>
        ) : (
          <CalendarView
            events={[
              ...schedules.map(s => {
                const isEvent = s.category && s.category !== 'CLASS';
                return {
                  id: s.id,
                  date: s.date,
                  title: isEvent ? (s.title || 'Event') : (s.module?.moduleName || 'Class'),
                  type: isEvent ? 'event' as const : 'class' as const,
                  moduleCode: s.module?.moduleCode,
                  time: `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`
                };
              }),
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
