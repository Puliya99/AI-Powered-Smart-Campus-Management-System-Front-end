import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Lock,
  Mail,
  User,
  UserCircle,
  Phone,
  CreditCard,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: string
  mobileNumber: string
  nic: string
}

const Register: React.FC = () => {
  const { register } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'ADMIN',
    mobileNumber: '',
    nic: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return { valid: false, message: 'First name is required' }
    }
    if (!formData.lastName.trim()) {
      return { valid: false, message: 'Last name is required' }
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return { valid: false, message: 'Valid email is required' }
    }
    if (!formData.username.trim() || formData.username.length < 3) {
      return { valid: false, message: 'Username must be at least 3 characters' }
    }
    if (formData.password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' }
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      return { valid: false, message: 'Password must contain uppercase, lowercase, and number' }
    }
    if (formData.password !== formData.confirmPassword) {
      return { valid: false, message: 'Passwords do not match' }
    }
    if (!formData.mobileNumber.trim()) {
      return { valid: false, message: 'Mobile number is required' }
    }
    if (formData.mobileNumber.length < 10) {
      return { valid: false, message: 'Mobile number must be at least 10 digits' }
    }
    if (!formData.nic.trim()) {
      return { valid: false, message: 'NIC is required' }
    }
    if (formData.nic.length < 9) {
      return { valid: false, message: 'NIC must be at least 9 characters' }
    }
    return { valid: true }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateForm()
    if (!validation.valid) {
      // Error will be shown by AuthContext
      return
    }

    setIsLoading(true)

    try {
      await register(formData)
      // Navigation handled by AuthContext
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full space-y-8 py-12">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-lg">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Join Smart Campus and start your journey
            </p>
          </div>

          {/* Form */}
          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                I am a <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base bg-white cursor-pointer"
              >
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="0771234567"
                />
              </div>
            </div>

            {/* NIC */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NIC Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="123456789V or 200012345678"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 text-base"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Password must contain:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  One uppercase and one lowercase letter
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  At least one number
                </li>
              </ul>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-6">
            <p className="text-base text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-500 transition"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section (same as login) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '700ms' }}
          ></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Join Our Smart Campus Community
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Experience cutting-edge education technology with AI-powered
              insights, real-time analytics, and seamless campus management.
            </p>
            <div className="space-y-4 mt-12">
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Instant Access</h3>
                  <p className="text-primary-100 text-sm">
                    Get started immediately after registration
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Secure & Private</h3>
                  <p className="text-primary-100 text-sm">
                    Your data is encrypted and protected
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">
                    All-in-One Platform
                  </h3>
                  <p className="text-primary-100 text-sm">
                    Everything you need in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register