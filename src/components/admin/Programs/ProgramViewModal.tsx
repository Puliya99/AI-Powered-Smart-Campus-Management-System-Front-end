import React, { useState, useEffect } from 'react'
import {
  X,
  BookOpen,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Info,
  Clock,
  Loader2,
  Hash,
  Award,
  MapPin,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface ProgramViewModalProps {
  isOpen: boolean
  onClose: () => void
  programId: string | null
}

const ProgramViewModal: React.FC<ProgramViewModalProps> = ({
  isOpen,
  onClose,
  programId,
}) => {
  const [loading, setLoading] = useState(false)
  const [program, setProgram] = useState<any>(null)

  useEffect(() => {
    if (isOpen && programId) {
      fetchProgramDetails()
    }
  }, [isOpen, programId])

  const fetchProgramDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/programs/${programId}`)
      setProgram(response.data.data.program)
    } catch (error: any) {
      toast.error('Failed to fetch program details')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount)
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
            <h3 className="text-xl font-semibold text-white">Program Details</h3>
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
            ) : program ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b dark:border-gray-700">
                  <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {program.programName}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {program.programCode}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {program.duration}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {formatCurrency(program.programFee)}
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
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <Hash className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Program Code</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{program.programCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{program.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Program Fee</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(program.programFee)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Centers */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> Available Centers
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                      {program.centers && program.centers.length > 0 ? (
                        program.centers.map((center: any) => (
                          <div key={center.id} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                            {center.centerName}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No centers assigned.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Description
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 h-full min-h-[120px]">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {program.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2" /> Program Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Modules</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{program.stats?.moduleCount || 0}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Total Enrollments</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{program.stats?.enrollmentCount || 0}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/30">
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Active Enrollments</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-300 mt-1">{program.stats?.activeEnrollments || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Related Data Tabs/Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                   {/* Modules List */}
                   <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary-600" />
                        Modules
                      </h5>
                      {program.modules && program.modules.length > 0 ? (
                        <div className="space-y-3">
                          {program.modules.slice(0, 5).map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.moduleName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{m.moduleCode} • {m.credits} Credits</p>
                              </div>
                              {m.lecturer && (
                                <span className="text-xs text-primary-600 font-medium">
                                  {m.lecturer.user.firstName}
                                </span>
                              )}
                            </div>
                          ))}
                          {program.modules.length > 5 && (
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                              + {program.modules.length - 5} more modules
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No modules assigned.</p>
                      )}
                   </div>

                   {/* Batches List */}
                   <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary-600" />
                        Active Batches
                      </h5>
                      {program.batches && program.batches.length > 0 ? (
                        <div className="space-y-3">
                          {program.batches.slice(0, 5).map((b: any) => (
                            <div key={b.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700 shadow-sm">
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.batchNumber}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Start: {new Date(b.startDate).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                b.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>{b.status}</span>
                            </div>
                          ))}
                          {program.batches.length > 5 && (
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                              + {program.batches.length - 5} more batches
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No batches found.</p>
                      )}
                   </div>
                </div>

                {/* Audit Info */}
                <div className="pt-6 border-t dark:border-gray-700 flex justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Created: {new Date(program.createdAt).toLocaleString()}
                  </div>
                  {program.updatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {new Date(program.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No program data found.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramViewModal
