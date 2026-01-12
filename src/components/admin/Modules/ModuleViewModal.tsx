import React, { useState, useEffect } from 'react'
import {
  X,
  BookOpen,
  User,
  Calendar,
  FileText,
  Info,
  Clock,
  Loader2,
  Hash,
  Award,
  CheckCircle,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface ModuleViewModalProps {
  isOpen: boolean
  onClose: () => void
  moduleId: string | null
}

const ModuleViewModal: React.FC<ModuleViewModalProps> = ({
  isOpen,
  onClose,
  moduleId,
}) => {
  const [loading, setLoading] = useState(false)
  const [moduleData, setModuleData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && moduleId) {
      fetchModuleDetails()
    }
  }, [isOpen, moduleId])

  const fetchModuleDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/modules/${moduleId}`)
      setModuleData(response.data.data.module)
    } catch (error: any) {
      toast.error('Failed to fetch module details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Module Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : moduleData ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {moduleData.moduleName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {moduleData.moduleCode}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Semester {moduleData.semesterNumber}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {moduleData.credits} Credits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Information */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <Info className="w-4 h-4 mr-2" /> General Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Hash className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Module Code</p>
                          <p className="text-sm font-medium text-gray-900">{moduleData.moduleCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Program</p>
                          <p className="text-sm font-medium text-gray-900">{moduleData.program?.programName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Award className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Credits</p>
                          <p className="text-sm font-medium text-gray-900">{moduleData.credits}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lecturer & Description */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <User className="w-4 h-4 mr-2" /> Academic Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Assigned Lecturer</p>
                          <p className="text-sm font-medium text-gray-900">
                            {moduleData.lecturer
                              ? `${moduleData.lecturer.user.title} ${moduleData.lecturer.user.firstName} ${moduleData.lecturer.user.lastName}`
                              : 'Not assigned'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Description</p>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {moduleData.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics/Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                      <p className="text-xs text-primary-600 font-medium">Schedules</p>
                      <p className="text-xl font-bold text-primary-900 mt-1">{moduleData.schedules?.length || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-xs text-green-600 font-medium">Assignments</p>
                      <p className="text-xl font-bold text-green-900 mt-1">{moduleData.assignments?.length || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium">Results</p>
                      <p className="text-xl font-bold text-purple-900 mt-1">{moduleData.results?.length || 0}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-600 font-medium">Feedbacks</p>
                      <p className="text-xl font-bold text-orange-900 mt-1">{moduleData.feedbacks?.length || 0}</p>
                    </div>
                </div>

                {/* Related Data Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                   {/* Schedules List */}
                   <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                        Recent Schedules
                      </h5>
                      {moduleData.schedules && moduleData.schedules.length > 0 ? (
                        <div className="space-y-3">
                          {moduleData.schedules.slice(0, 5).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{s.batch?.batchNumber || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{s.date} • {s.startTime} - {s.endTime}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>{s.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic text-center py-4">No schedules found.</p>
                      )}
                   </div>

                   {/* Assignments List */}
                   <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary-600" />
                        Assignments
                      </h5>
                      {moduleData.assignments && moduleData.assignments.length > 0 ? (
                        <div className="space-y-3">
                          {moduleData.assignments.slice(0, 5).map((a: any) => (
                            <div key={a.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                                <p className="text-xs text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{a.type}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic text-center py-4">No assignments found.</p>
                      )}
                   </div>
                </div>

                {/* Audit Info */}
                <div className="pt-6 border-t flex justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {new Date(moduleData.createdAt).toLocaleString()}
                  </div>
                  {moduleData.updatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(moduleData.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No module data found.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleViewModal
