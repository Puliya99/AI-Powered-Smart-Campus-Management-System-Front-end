import React, { useState, useEffect } from 'react'
import {
  Video,
  Plus,
  Search,
  Calendar,
  Users,
  ArrowRight,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/api/axios.config'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import toast from 'react-hot-toast'

const OnlineClassesPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeMeetings, setActiveMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [modules, setModules] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: '',
    moduleId: '',
  })

  useEffect(() => {
    fetchActiveMeetings()
    fetchLecturerModules()
  }, [])

  const fetchActiveMeetings = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/video-meetings/my-active')
      setActiveMeetings(response.data.data.meetings)
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
      toast.error('Failed to load active meetings')
    } finally {
      setLoading(false)
    }
  }

  const fetchLecturerModules = async () => {
    try {
      const response = await axiosInstance.get('/lecturers/profile/me')
      setModules(response.data.data.lecturer.modules || [])
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    }
  }

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.moduleId) {
      return toast.error('Please fill all fields')
    }

    try {
      const response = await axiosInstance.post('/video-meetings', formData)
      toast.success('Meeting created successfully!')
      setShowCreateModal(false)
      navigate(`/video/room/${response.data.data.meeting.meetingCode}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create meeting')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Online Classes</h1>
            <p className="text-gray-600 mt-1">
              Host and manage virtual lectures.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start Online Lecture
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : activeMeetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Video className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                      Live
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {meeting.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {meeting.module?.moduleName}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-2" />
                      Started {new Date(meeting.startTime).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3.5 w-3.5 mr-2" />
                      Meeting Code:{' '}
                      <span className="ml-1 font-mono font-bold text-gray-700">
                        {meeting.meetingCode}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/video/room/${meeting.meetingCode}`)
                    }
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Join Room
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No active classes
            </h3>
            <p className="text-gray-500 mt-1">
              Start a new online lecture to interact with your students.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start First Class
            </button>
          </div>
        )}

        {/* Create Meeting Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-primary-600">
                <h2 className="text-xl font-bold text-white">
                  Start Online Lecture
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g., Introduction to Advanced React"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.moduleId}
                    onChange={(e) =>
                      setFormData({ ...formData, moduleId: e.target.value })
                    }
                  >
                    <option value="">Select a module</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.moduleCode} - {m.moduleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Start Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default OnlineClassesPage
