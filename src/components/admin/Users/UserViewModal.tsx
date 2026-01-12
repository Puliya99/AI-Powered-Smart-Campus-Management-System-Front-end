import React, { useState, useEffect } from 'react'
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Building,
  Hash,
} from 'lucide-react'
import axiosInstance from '../../../services/api/axios.config'
import toast from 'react-hot-toast'

interface UserViewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | null
}

const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/users/${userId}`)
      setUser(response.data.data.user)
    } catch (error: any) {
      toast.error('Failed to fetch user details')
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
            <h3 className="text-xl font-semibold text-white">User Details</h3>
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
            ) : user ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-3xl font-bold">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.title} {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-500 font-medium">
                      {user.username} • {user.registrationNumber}
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role === 'USER' ? 'STAFF' : user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">NIC Number</p>
                        <p className="font-medium text-gray-900">{user.nic}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-900">{user.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Join Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
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
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Mobile Number</p>
                          <p className="font-medium text-gray-900">
                            {user.mobileNumber}
                          </p>
                        </div>
                      </div>
                      {user.homeNumber && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-3 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Home Number</p>
                            <p className="font-medium text-gray-900">
                              {user.homeNumber}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {user.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-primary-600" />
                      Administrative Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Assigned Center</p>
                        <p className="font-medium text-gray-900">
                          {user.center?.centerName || 'Not Assigned'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration No.</p>
                        <p className="font-medium text-gray-900">
                          {user.registrationNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium text-gray-900">
                           {user.role === 'USER' ? 'STAFF' : user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                User data not found
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserViewModal
