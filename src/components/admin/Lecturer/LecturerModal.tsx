import React, { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'
import { useAuth } from '../../../context/AuthContext'

interface LecturerModalProps {
  isOpen: boolean
  onClose: () => void
  lecturer?: any | null
  onSuccess: () => void
}

interface FormData {
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
  specialization: string
  qualification: string
  centerId: string
}

const LecturerModal: React.FC<LecturerModalProps> = ({
  isOpen,
  onClose,
  lecturer,
  onSuccess,
}) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<any[]>([])
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
    specialization: '',
    qualification: '',
    centerId: '',
  })

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/dropdown')
      const fetchedCenters = response.data.data.centers
      setCenters(fetchedCenters)
      if (!isAdmin && fetchedCenters.length === 1 && !formData.centerId) {
        setFormData(prev => ({ ...prev, centerId: fetchedCenters[0].id }))
      }
    } catch (error) {
      console.error('Failed to fetch centers', error)
    }
  }

  useEffect(() => {
    if (lecturer) {
      setFormData({
        username: lecturer.user.username || '',
        email: lecturer.user.email || '',
        password: '',
        title: lecturer.user.title || 'Mr',
        firstName: lecturer.user.firstName || '',
        lastName: lecturer.user.lastName || '',
        gender: lecturer.user.gender || 'MALE',
        dateOfBirth: lecturer.user.dateOfBirth?.split('T')[0] || '',
        nic: lecturer.user.nic || '',
        address: lecturer.user.address || '',
        mobileNumber: lecturer.user.mobileNumber || '',
        homeNumber: lecturer.user.homeNumber || '',
        specialization: lecturer.specialization || '',
        qualification: lecturer.qualification || '',
        centerId: lecturer.user.center?.id || '',
      })
    } else {
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
        specialization: '',
        qualification: '',
        centerId: '',
      })
    }
  }, [lecturer])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) { toast.error('First name is required'); return false }
    if (!formData.lastName.trim()) { toast.error('Last name is required'); return false }
    if (!formData.email.trim() || !formData.email.includes('@')) { toast.error('Valid email is required'); return false }
    if (!formData.username.trim() || formData.username.length < 3) { toast.error('Username must be at least 3 characters'); return false }
    if (!lecturer && (!formData.password || formData.password.length < 8)) { toast.error('Password must be at least 8 characters'); return false }
    if (!formData.mobileNumber.trim()) { toast.error('Mobile number is required'); return false }
    if (!formData.nic.trim()) { toast.error('NIC is required'); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      if (lecturer) {
        await axiosInstance.put(`/lecturers/${lecturer.id}`, {
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
            centerId: formData.centerId,
          },
          specialization: formData.specialization,
          qualification: formData.qualification,
        })
        toast.success('Lecturer updated successfully')
      } else {
        await axiosInstance.post('/lecturers', formData)
        toast.success('Lecturer created successfully')
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${lecturer ? 'update' : 'create'} lecturer`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {lecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">
                    Personal Information
                  </h4>
                </div>

                <div>
                  <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                  <select name="title" value={formData.title} onChange={handleChange} required className={inputClass}>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClass} placeholder="John" />
                </div>

                <div>
                  <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className={inputClass} placeholder="Doe" />
                </div>

                <div>
                  <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>NIC <span className="text-red-500">*</span></label>
                  <input type="text" name="nic" value={formData.nic} onChange={handleChange} required className={inputClass} placeholder="123456789V" />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">
                    Account Information
                  </h4>
                </div>

                <div>
                  <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} required disabled={!!lecturer}
                    className={`${inputClass} disabled:bg-gray-100 dark:disabled:bg-gray-700`} placeholder="johndoe" />
                </div>

                <div>
                  <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john.doe@example.com" />
                </div>

                {!lecturer && (
                  <div>
                    <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder="Minimum 8 characters" />
                  </div>
                )}

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">
                    Contact Information
                  </h4>
                </div>

                <div>
                  <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputClass} placeholder="0771234567" />
                </div>

                <div>
                  <label className={labelClass}>Home Number</label>
                  <input type="tel" name="homeNumber" value={formData.homeNumber} onChange={handleChange} className={inputClass} placeholder="0112345678" />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Address <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className={inputClass} placeholder="Enter full address" />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">
                    Professional Information
                  </h4>
                </div>

                {isAdmin ? (
                  <div>
                    <label className={labelClass}>Center <span className="text-red-500">*</span></label>
                    <select name="centerId" value={formData.centerId} onChange={handleChange} required className={inputClass}>
                      <option value="">Select Center</option>
                      {centers.map((center) => (
                        <option key={center.id} value={center.id}>{center.centerName}</option>
                      ))}
                    </select>
                  </div>
                ) : formData.centerId && centers.length > 0 ? (
                  <div>
                    <label className={labelClass}>Center</label>
                    <p className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                      {centers.find(c => c.id === formData.centerId)?.centerName || 'Your Center'}
                    </p>
                  </div>
                ) : null}

                <div>
                  <label className={labelClass}>Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass} placeholder="e.g., Computer Science, Mathematics" />
                </div>

                <div>
                  <label className={labelClass}>Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass} placeholder="e.g., PhD, MSc, BSc" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end space-x-3">
              <button type="button" onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50">
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{lecturer ? 'Updating...' : 'Creating...'}</>
                ) : (
                  <><Save className="w-5 h-5 mr-2" />{lecturer ? 'Update Lecturer' : 'Create Lecturer'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LecturerModal
