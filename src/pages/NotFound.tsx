import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 mt-2 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
