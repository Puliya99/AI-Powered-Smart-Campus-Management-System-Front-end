import React from 'react'

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Register
        </h2>
        <p className="text-center text-gray-600">
          Registration page - Coming soon
        </p>
        <div className="mt-6 text-center">
          <a href="/login" className="text-primary-600 hover:text-primary-500">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register
