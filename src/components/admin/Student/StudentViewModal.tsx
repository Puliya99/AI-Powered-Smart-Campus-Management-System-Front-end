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
  Brain,
  TrendingUp,
  History,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'
import RiskMeter from '../../shared/AI/RiskMeter'
import RiskDetailsCard from '../../shared/AI/RiskDetailsCard'

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
  const [predictions, setPredictions] = useState<any[]>([])
  const [loadingPredictions, setLoadingPredictions] = useState(false)

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails()
      fetchPredictions()
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

  const fetchPredictions = async () => {
    try {
      setLoadingPredictions(true)
      const response = await axiosInstance.get(`/ai/predictions/student/${studentId}`)
      setPredictions(response.data.data)
    } catch (error: any) {
      console.error('Failed to fetch predictions:', error)
    } finally {
      setLoadingPredictions(false)
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

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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

          <div className="bg-white dark:bg-gray-800 px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : student ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b dark:border-gray-700">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {student.user.firstName.charAt(0)}
                    {student.user.lastName.charAt(0)}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {student.user.title} {student.user.firstName} {student.user.lastName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {student.universityNumber}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          student.user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {student.user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Student
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        {student.paymentType} Payment
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">NIC:</span>
                        <span className="text-gray-900 dark:text-white">{student.user.nic}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Gender:</span>
                        <span className="text-gray-900 dark:text-white capitalize">
                          {student.user.gender.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Date of Birth:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(student.user.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Joined:</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(student.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-primary-600" />
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{student.user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{student.user.mobileNumber}</span>
                      </div>
                      {student.user.homeNumber && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{student.user.homeNumber}</span>
                        </div>
                      )}
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{student.user.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                      Academic & Enrollment Information
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Center:</span>
                        <span className="text-gray-900 dark:text-white">
                          {student.user.center?.centerName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Hash className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400 w-32 font-medium">Reg No:</span>
                        <span className="text-gray-900 dark:text-white">
                          {student.user.registrationNumber}
                        </span>
                      </div>
                    </div>

                    {student.enrollments && student.enrollments.length > 0 ? (
                      <div className="mt-4 border dark:border-gray-700 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Program
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Batch
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            {student.enrollments.map((en: any) => (
                              <tr key={en.id}>
                                <td className="px-4 py-2 text-gray-900 dark:text-white">
                                  {en.program?.programName}
                                </td>
                                <td className="px-4 py-2 text-gray-900 dark:text-white">
                                  {en.batch?.batchNumber}
                                </td>
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                  {new Date(en.enrollmentDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    en.status === 'ACTIVE'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No enrollments found.</p>
                    )}
                  </div>

                  {/* AI Risk Prediction */}
                  <div className="space-y-4 md:col-span-2 pt-6 border-t dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-600" />
                        AI Examination Risk Prediction
                      </div>
                      {predictions.length > 0 && (
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400 flex items-center">
                          <History className="w-3 h-3 mr-1" />
                          Last updated: {new Date(predictions[0].createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </h4>

                    {loadingPredictions ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                      </div>
                    ) : predictions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Risk Status</span>
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                          </div>
                          <RiskMeter
                            score={parseFloat(predictions[0].riskScore)}
                            level={predictions[0].riskLevel}
                            size="lg"
                          />
                        </div>
                        <RiskDetailsCard
                          reasons={predictions[0].factors?.reasons || []}
                          recommendation={predictions[0].recommendation}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center border border-dashed border-gray-300 dark:border-gray-600">
                        <Brain className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-50" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No AI risk prediction data available for this student yet.
                          Predictions are generated weekly or after significant academic updates.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Summary Stats */}
                  <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-700">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <CheckCircle className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Attendance</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                        {student.attendances?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <CreditCard className="w-5 h-5 mx-auto text-green-600 mb-1" />
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Payments</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-300">
                        {student.payments?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <FileText className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Assignments</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                        {student.assignments?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                      <Clock className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Results</p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-300">
                        {student.results?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                Student not found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
