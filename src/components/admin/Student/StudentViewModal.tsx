import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Building,
  Hash,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface StudentViewModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string | null
}

const StudentViewModal: React.FC<StudentViewModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState<any>(null)

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails()
    }
  }, [isOpen, studentId])

  const fetchStudentDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/students/${studentId}`)
      setStudent(response.data.data.student)
    } catch (error: any) {
      toast.error('Failed to fetch student details')
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
            <h3 className="text-xl font-semibold text-white">Student Details</h3>
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
            ) : student ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {student.user.firstName.charAt(0)}
                    {student.user.lastName.charAt(0)}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {student.user.title} {student.user.firstName} {student.user.lastName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {student.universityNumber}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          student.user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Student
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {student.paymentType} Payment
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
                        <span className="text-gray-500 w-32 font-medium">NIC:</span>
                        <span className="text-gray-900">{student.user.nic}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32 font-medium">Gender:</span>
                        <span className="text-gray-900 capitalize">
                          {student.user.gender.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32 font-medium">Date of Birth:</span>
                        <span className="text-gray-900">
                          {new Date(student.user.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32 font-medium">Joined:</span>
                        <span className="text-gray-900">
                          {new Date(student.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-primary-600" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{student.user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{student.user.mobileNumber}</span>
                      </div>
                      {student.user.homeNumber && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{student.user.homeNumber}</span>
                        </div>
                      )}
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <span className="text-gray-900">{student.user.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                      Academic & Enrollment Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 w-32 font-medium">Center:</span>
                        <span className="text-gray-900">
                          {student.user.center?.centerName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Hash className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 w-32 font-medium">Reg No:</span>
                        <span className="text-gray-900">
                          {student.user.registrationNumber}
                        </span>
                      </div>
                    </div>

                    {student.enrollments && student.enrollments.length > 0 ? (
                      <div className="mt-4 border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Program
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Batch
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {student.enrollments.map((en: any) => (
                              <tr key={en.id}>
                                <td className="px-4 py-2 text-gray-900">
                                  {en.program?.programName}
                                </td>
                                <td className="px-4 py-2 text-gray-900">
                                  {en.batch?.batchNumber}
                                </td>
                                <td className="px-4 py-2 text-gray-500">
                                  {new Date(en.enrollmentDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    en.status === 'ACTIVE' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {en.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No enrollments found.</p>
                    )}
                  </div>

                  {/* Summary Stats (Optional but nice) */}
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <CheckCircle className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                      <p className="text-xs text-blue-600 font-medium">Attendance</p>
                      <p className="text-lg font-bold text-blue-900">
                        {student.attendances?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <CreditCard className="w-5 h-5 mx-auto text-green-600 mb-1" />
                      <p className="text-xs text-green-600 font-medium">Payments</p>
                      <p className="text-lg font-bold text-green-900">
                        {student.payments?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <FileText className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                      <p className="text-xs text-purple-600 font-medium">Assignments</p>
                      <p className="text-lg font-bold text-purple-900">
                        {student.assignments?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <Clock className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                      <p className="text-xs text-orange-600 font-medium">Results</p>
                      <p className="text-lg font-bold text-orange-900">
                        {student.results?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                Student not found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
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

export default StudentViewModal
