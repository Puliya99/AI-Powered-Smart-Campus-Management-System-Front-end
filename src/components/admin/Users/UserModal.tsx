import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User, Mail, Shield, Phone, MapPin, Calendar, Lock } from 'lucide-react';
import axiosInstance from '../../../services/api/axios.config';
import userService from '../../../services/user.service';
import toast from 'react-hot-toast';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any | null;
  onSuccess: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    title: 'Mr',
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dateOfBirth: '',
    nic: '',
    address: '',
    mobileNumber: '',
    homeNumber: '',
    centerId: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCenters();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't pre-fill password for editing
        role: user.role || 'STUDENT',
        title: user.title || 'Mr',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        gender: user.gender || 'MALE',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        nic: user.nic || '',
        address: user.address || '',
        mobileNumber: user.mobileNumber || '',
        homeNumber: user.homeNumber || '',
        centerId: user.center?.id || '',
        isActive: user.isActive ?? true,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT',
        title: 'Mr',
        firstName: '',
        lastName: '',
        gender: 'MALE',
        dateOfBirth: '',
        nic: '',
        address: '',
        mobileNumber: '',
        homeNumber: '',
        centerId: '',
        isActive: true,
      });
    }
  }, [user, isOpen]);

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/dropdown');
      setCenters(response.data.data.centers || []);
    } catch (error) {
      console.error('Failed to fetch centers:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      if (user && !payload.password) {
        delete (payload as any).password;
      }

      if (user) {
        await userService.updateUser(user.id, payload);
        toast.success('User updated successfully');
      } else {
        await userService.createUser(payload);
        toast.success('User created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              {user ? 'Edit User' : 'Add New User'}
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" /> Account Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Username *</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="LECTURER">Lecturer</option>
                      <option value="ADMIN">Admin</option>
                      <option value="USER">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Center</label>
                    <select
                      name="centerId"
                      value={formData.centerId}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                    >
                      <option value="">Select Center</option>
                      {centers.map(c => (
                        <option key={c.id} value={c.id}>{c.centerName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password {user && '(Leave blank to keep current)'} {!user && '*'}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required={!user}
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active Account
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 border-b pb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" /> Personal Details
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-2 flex space-x-4">
                      {['MALE', 'FEMALE', 'OTHER'].map(g => (
                        <label key={g} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{g.toLowerCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NIC *</label>
                    <input
                      type="text"
                      name="nic"
                      required
                      value={formData.nic}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border px-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="mobileNumber"
                        required
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="homeNumber"
                        value={formData.homeNumber}
                        onChange={handleChange}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-10 border"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-10 pt-2 border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm border"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {user ? 'Update User' : 'Create User'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
