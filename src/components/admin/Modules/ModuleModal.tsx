import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface ModuleModalProps {
  isOpen: boolean
  onClose: () => void
  module?: any | null
  onSuccess: () => void
}

interface FormData {
  moduleCode: string
  moduleName: string
  semesterNumber: string
  credits: string
  description: string
  programId: string
  lecturerId: string
}

interface Program {
  id: string
  programCode: string
  programName: string
}

interface Lecturer {
  id: string
  user: {
    firstName: string
    lastName: string
  }
}

const ModuleModal: React.FC<ModuleModalProps> = ({
  isOpen,
  onClose,
  module,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [formData, setFormData] = useState<FormData>({
    moduleCode: '',
    moduleName: '',
    semesterNumber: '',
    credits: '',
    description: '',
    programId: '',
    lecturerId: '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchPrograms()
      fetchLecturers()
    }
  }, [isOpen])

  useEffect(() => {
    if (module) {
      setFormData({
        moduleCode: module.moduleCode || '',
        moduleName: module.moduleName || '',
        semesterNumber: module.semesterNumber?.toString() || '',
        credits: module.credits?.toString() || '',
        description: module.description || '',
        programId: module.program?.id || '',
        lecturerId: module.lecturer?.id || '',
      })
    } else {
      setFormData({
        moduleCode: '',
        moduleName: '',
        semesterNumber: '',
        credits: '',
        description: '',
        programId: '',
        lecturerId: '',
      })
    }
  }, [module])

  const fetchPrograms = async () => {
    try {
      setLoadingData(true)
      const response = await axiosInstance.get('/programs/dropdown')
      setPrograms(response.data.data.programs)
    } catch (error) {
      console.error('Failed to fetch programs:', error)
      toast.error('Failed to load programs')
    } finally {
      setLoadingData(false)
    }
  }

  const fetchLecturers = async () => {
    try {
      const response = await axiosInstance.get('/lecturers')
      setLecturers(response.data.data.lecturers || [])
    } catch (error) {
      console.error('Failed to fetch lecturers:', error)
      toast.error('Failed to load lecturers')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.moduleCode.trim()) {
      toast.error('Module code is required')
      return false
    }
    if (!formData.moduleName.trim()) {
      toast.error('Module name is required')
      return false
    }
    if (!formData.semesterNumber) {
      toast.error('Semester number is required')
      return false
    }
    if (!formData.programId) {
      toast.error('Please select a program')
      return false
    }
    if (formData.credits && parseFloat(formData.credits) < 0) {
      toast.error('Credits cannot be negative')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        moduleCode: formData.moduleCode,
        moduleName: formData.moduleName,
        semesterNumber: parseInt(formData.semesterNumber),
        credits: formData.credits ? parseInt(formData.credits) : null,
        description: formData.description,
        programId: formData.programId,
        lecturerId: formData.lecturerId || null,
      }

      if (module) {
        await axiosInstance.put(`/modules/${module.id}`, payload)
        toast.success('Module updated successfully')
      } else {
        await axiosInstance.post('/modules', payload)
        toast.success('Module created successfully')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${module ? 'update' : 'create'} module`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {module ? 'Edit Module' : 'Add New Module'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-5 space-y-6">
              {loadingData ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <>
                  {/* Module Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="moduleCode"
                      value={formData.moduleCode}
                      onChange={handleChange}
                      required
                      disabled={!!module}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="e.g., CS101"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Unique identifier for the module
                    </p>
                  </div>

                  {/* Module Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="moduleName"
                      value={formData.moduleName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Introduction to Computer Science"
                    />
                  </div>

                  {/* Program Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="programId"
                      value={formData.programId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.programCode} - {program.programName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester and Credits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="semesterNumber"
                        value={formData.semesterNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credits
                      </label>
                      <input
                        type="number"
                        name="credits"
                        value={formData.credits}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 3"
                      />
                    </div>
                  </div>

                  {/* Lecturer Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Lecturer
                    </label>
                    <select
                      name="lecturerId"
                      value={formData.lecturerId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">No lecturer assigned</option>
                      {lecturers.map((lecturer) => (
                        <option key={lecturer.id} value={lecturer.id}>
                          {lecturer.user.firstName} {lecturer.user.lastName}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      You can assign a lecturer later if needed
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter module description, learning outcomes, and key topics..."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingData}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {module ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {module ? 'Update Module' : 'Create Module'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModuleModal
