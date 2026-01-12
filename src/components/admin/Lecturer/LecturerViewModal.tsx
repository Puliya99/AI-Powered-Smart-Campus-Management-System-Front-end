import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Loader2,
  Building,
  Hash,
  Award,
  Briefcase,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface LecturerViewModalProps {
  isOpen: boolean
  onClose: () => void
  lecturerId: string | null
}

const LecturerViewModal: React.FC<LecturerViewModalProps> = ({
  isOpen,
  onClose,
  lecturerId,
}) => {
  const [loading, setLoading] = useState(false)
  const [lecturer, setLecturer] = useState<any>(null)

  useEffect(() => {
    if (isOpen && lecturerId) {
      fetchLecturerDetails()
    }
  }, [isOpen, lecturerId])

  const fetchLecturerDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/lecturers/${lecturerId}`)
      setLecturer(response.data.data.lecturer)
    } catch (error: any) {
      toast.error('Failed to fetch lecturer details')
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
            <h3 className="text-xl font-semibold text-white">Lecturer Details</h3>
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
            ) : lecturer ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {lecturer.user.firstName.charAt(0)}
                    {lecturer.user.lastName.charAt(0)}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {lecturer.user.title} {lecturer.user.firstName} {lecturer.user.lastName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {lecturer.specialization || 'No Specialization'}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          lecturer.user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {lecturer.user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Lecturer
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">NIC:</span>
                        <span className="text-gray-900 font-medium">{lecturer.user.nic}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Gender:</span>
                        <span className="text-gray-900 font-medium capitalize">
                          {lecturer.user.gender.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Date of Birth:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(lecturer.user.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Join Date:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(lecturer.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-primary-600" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start text-sm">
                        <Mail className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-gray-500 text-xs">Email Address</p>
                          <p className="text-gray-900 font-medium">{lecturer.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <Phone className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-xs">Mobile</p>
                            <p className="text-gray-900 font-medium">{lecturer.user.mobileNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Home</p>
                            <p className="text-gray-900 font-medium">{lecturer.user.homeNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-gray-500 text-xs">Current Address</p>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {lecturer.user.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-primary-600" />
                      Academic Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 w-32">Assigned Center:</span>
                        <span className="text-gray-900 font-medium">
                          {lecturer.user.center?.centerName || 'Not Assigned'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Hash className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 w-32">Reg Number:</span>
                        <span className="text-gray-900 font-medium">{lecturer.user.registrationNumber}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <Briefcase className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <div>
                          <p className="text-gray-500 text-xs">Qualification</p>
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {lecturer.qualification || 'No Qualification Listed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                      Workload Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                          Modules
                        </p>
                        <p className="text-2xl font-bold text-primary-600 mt-1">
                          {lecturer.stats?.moduleCount || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                          Schedules
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {lecturer.stats?.scheduleCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Modules */}
                <div className="space-y-4 pb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                    Assigned Modules
                  </h4>
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Module Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Module Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Program
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lecturer.modules && lecturer.modules.length > 0 ? (
                          lecturer.modules.map((module: any) => (
                            <tr key={module.id} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {module.moduleCode}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {module.moduleName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {module.program?.programName || 'N/A'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                              No modules assigned yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 italic">No lecturer data available.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LecturerViewModal
