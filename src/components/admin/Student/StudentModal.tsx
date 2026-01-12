import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  student?: any | null
  onSuccess: () => void
}

interface FormData {
  // User fields
  username: string
  email: string
  password: string
  title: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  nic: string
  address: string
  mobileNumber: string
  homeNumber: string

  // Student fields
  paymentType: string
  centerId: string
  programId: string
  batchId: string
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    title: 'Mr',
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dateOfBirth: '',
    nic: '',
    address: '',
    mobileNumber: '',
    homeNumber: '',
    paymentType: 'FULL',
    centerId: '',
    programId: '',
    batchId: '',
  })

  useEffect(() => {
    fetchSelectionData()
  }, [])

  const fetchSelectionData = async () => {
    try {
      const [centersRes, programsRes, batchesRes] = await Promise.all([
        axiosInstance.get('/centers/dropdown'),
        axiosInstance.get('/programs/dropdown'),
        axiosInstance.get('/batches/dropdown'),
      ])
      setCenters(centersRes.data.data.centers)
      setPrograms(programsRes.data.data.programs)
      setBatches(batchesRes.data.data.batches)
    } catch (error) {
      console.error('Failed to fetch selection data', error)
    }
  }

  useEffect(() => {
    if (student) {
      setFormData({
        username: student.user.username || '',
        email: student.user.email || '',
        password: '',
        title: student.user.title || 'Mr',
        firstName: student.user.firstName || '',
        lastName: student.user.lastName || '',
        gender: student.user.gender || 'MALE',
        dateOfBirth: student.user.dateOfBirth?.split('T')[0] || '',
        nic: student.user.nic || '',
        address: student.user.address || '',
        mobileNumber: student.user.mobileNumber || '',
        homeNumber: student.user.homeNumber || '',
        paymentType: student.paymentType || 'FULL',
        centerId: student.user.center?.id || '',
        programId: student.enrollments?.[0]?.program?.id || '',
        batchId: student.enrollments?.[0]?.batch?.id || '',
      })
    } else {
      // Reset form for new student
      setFormData({
        username: '',
        email: '',
        password: '',
        title: 'Mr',
        firstName: '',
        lastName: '',
        gender: 'MALE',
        dateOfBirth: '',
        nic: '',
        address: '',
        mobileNumber: '',
        homeNumber: '',
        paymentType: 'FULL',
        centerId: '',
        programId: '',
        batchId: '',
      })
    }
  }, [student])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    if (name === 'programId') {
      setFormData({
        ...formData,
        [name]: value,
        batchId: '', // Reset batch when program changes
      })
    } else if (name === 'batchId') {
      const selectedBatch = batches.find((b) => b.id === value)
      if (selectedBatch && selectedBatch.program) {
        setFormData({
          ...formData,
          [name]: value,
          programId: selectedBatch.program.id,
        })
      } else {
        setFormData({
          ...formData,
          [name]: value,
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Valid email is required')
      return false
    }
    if (!formData.username.trim() || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return false
    }
    if (!student && (!formData.password || formData.password.length < 8)) {
      toast.error('Password must be at least 8 characters')
      return false
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('Mobile number is required')
      return false
    }
    if (!formData.nic.trim()) {
      toast.error('NIC is required')
      return false
    }
    if (!student && !formData.centerId) {
      toast.error('Center is required')
      return false
    }
    if (!student && !formData.programId) {
      toast.error('Program is required')
      return false
    }
    if (!student && !formData.batchId) {
      toast.error('Batch is required')
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
      if (student) {
        // Update existing student
        await axiosInstance.put(`/students/${student.id}`, {
          user: {
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            nic: formData.nic,
            address: formData.address,
            mobileNumber: formData.mobileNumber,
            homeNumber: formData.homeNumber,
            center: formData.centerId ? { id: formData.centerId } : null,
          },
          paymentType: formData.paymentType,
          centerId: formData.centerId,
          programId: formData.programId,
          batchId: formData.batchId,
        })
        toast.success('Student updated successfully')
      } else {
        // Create new student
        await axiosInstance.post('/students', formData)
        toast.success('Student created successfully')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${student ? 'update' : 'create'} student`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const filteredBatches = batches.filter((b) => {
    if (!formData.programId) return true
    // If b.program is just an ID (due to how TypeORM might return it if not careful, 
    // but we use leftJoinAndSelect with select)
    return b.program?.id === formData.programId
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {student ? 'Edit Student' : 'Add New Student'}
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
            <div className="bg-white px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Personal Information
                  </h4>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Account Information */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Account Information
                  </h4>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={!!student}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="johndoe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>

                {/* Password (only for new students) */}
                {!student && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                )}

                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="FULL">Full Payment</option>
                    <option value="INSTALLMENT">Installment</option>
                  </select>
                </div>

                {/* Academic Information */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Academic Information
                  </h4>
                </div>

                {/* Center */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Program */}
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
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.programName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Batch</option>
                    {filteredBatches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batchNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123456789V"
                  />
                </div>

                {/* Contact Information */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Contact Information
                  </h4>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0771234567"
                  />
                </div>

                {/* Home Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Number
                  </label>
                  <input
                    type="tel"
                    name="homeNumber"
                    value={formData.homeNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0112345678"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
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
                disabled={loading}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {student ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {student ? 'Update Student' : 'Create Student'}
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

export default StudentModal
