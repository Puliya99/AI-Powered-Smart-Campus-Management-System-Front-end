import React, { useState, useEffect } from 'react'
import {
  X,
  Save,
  Loader2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api/v1'

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  schedule: any
  onSuccess: () => void
}

interface StudentAttendance {
  student: {
    id: string
    user: {
      firstName: string
      lastName: string
      registrationNumber: string
    }
  }
  attendance: any | null
  marked: boolean
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [attendanceData, setAttendanceData] = useState<
    Map<string, { status: string; remarks: string }>
  >(new Map())
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    unmarked: 0,
  })

  useEffect(() => {
    if (isOpen && schedule) {
      fetchScheduleAttendance()
    }
  }, [isOpen, schedule])

  const fetchScheduleAttendance = async () => {
    try {
      setLoadingData(true)
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/attendance/schedule/${schedule.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const result = await response.json()
      const data = result.data
      setStudents(data.students)
      setStats(data.stats)

      const initialData = new Map()
      data.students.forEach((s: StudentAttendance) => {
        if (s.attendance) {
          initialData.set(s.student.id, {
            status: s.attendance.status,
            remarks: s.attendance.remarks || '',
          })
        } else {
          initialData.set(s.student.id, {
            status: 'PRESENT',
            remarks: '',
          })
        }
      })
      setAttendanceData(initialData)
    } catch (error: any) {
      console.error('Failed to fetch attendance:', error)
      alert('Failed to load attendance data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    const current = attendanceData.get(studentId) || {
      status: 'PRESENT',
      remarks: '',
    }
    setAttendanceData(
      new Map(attendanceData.set(studentId, { ...current, status }))
    )
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    const current = attendanceData.get(studentId) || {
      status: 'PRESENT',
      remarks: '',
    }
    setAttendanceData(
      new Map(attendanceData.set(studentId, { ...current, remarks }))
    )
  }

  const handleMarkAll = (status: string) => {
    const newData = new Map(attendanceData)
    students.forEach((s) => {
      const current = newData.get(s.student.id) || {
        status: 'PRESENT',
        remarks: '',
      }
      newData.set(s.student.id, { ...current, status })
    })
    setAttendanceData(newData)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const payload = {
        scheduleId: schedule.id,
        attendanceData: Array.from(attendanceData.entries()).map(
          ([studentId, data]) => ({
            studentId,
            status: data.status,
            remarks: data.remarks,
          })
        ),
      }

      const response = await fetch(`${API_URL}/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to mark attendance')

      alert('Attendance marked successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.message || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'LATE':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'EXCUSED':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'ABSENT':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'LATE':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'EXCUSED':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Mark Attendance
              </h3>
              <p className="text-sm text-primary-100 mt-1">
                {schedule?.module?.moduleName} - {schedule?.batch?.batchNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!loadingData && (
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-6 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Present</p>
                  <p className="text-lg font-bold text-green-600">
                    {stats.present}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Absent</p>
                  <p className="text-lg font-bold text-red-600">
                    {stats.absent}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Late</p>
                  <p className="text-lg font-bold text-orange-600">
                    {stats.late}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Excused</p>
                  <p className="text-lg font-bold text-blue-600">
                    {stats.excused}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Unmarked</p>
                  <p className="text-lg font-bold text-gray-600">
                    {stats.unmarked}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loadingData && students.length > 0 && (
            <div className="bg-white px-6 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Mark all as:
                </span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('PRESENT')}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('ABSENT')}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('LATE')}
                  className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                >
                  Late
                </button>
              </div>
            </div>
          )}

          <div className="bg-white px-6 py-5 max-h-[calc(100vh-400px)] overflow-y-auto">
            {loadingData ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No students enrolled in this batch
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((s) => {
                  const data = attendanceData.get(s.student.id)
                  return (
                    <div
                      key={s.student.id}
                      className={`border-2 rounded-lg p-4 ${getStatusColor(
                        data?.status || 'PRESENT'
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-3">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {s.student.user.firstName}{' '}
                              {s.student.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {s.student.user.registrationNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(
                            (status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  handleStatusChange(s.student.id, status)
                                }
                                className={`p-2 rounded-lg border-2 transition ${
                                  data?.status === status
                                    ? 'border-gray-900 bg-white shadow-md'
                                    : 'border-transparent bg-white/50 hover:bg-white'
                                }`}
                                title={status}
                              >
                                {getStatusIcon(status)}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Add remarks (optional)"
                          value={data?.remarks || ''}
                          onChange={(e) =>
                            handleRemarksChange(s.student.id, e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || loadingData || students.length === 0}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceModal
