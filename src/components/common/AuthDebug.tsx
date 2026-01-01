// src/components/common/AuthDebug.tsx
// Add this temporarily to your Login page to debug

import React from 'react'
import { useAuth } from '../../context/AuthContext'

export const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs">
      <h4 className="font-bold mb-2">Auth Debug Info:</h4>
      <div className="space-y-1">
        <p>
          <span className="font-semibold">Loading:</span>{' '}
          {isLoading ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="font-semibold">Authenticated:</span>{' '}
          {isAuthenticated ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="font-semibold">Has Token:</span>{' '}
          {token ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="font-semibold">Has User:</span> {user ? 'Yes' : 'No'}
        </p>
        {user && (
          <>
            <p>
              <span className="font-semibold">User Role:</span> {user.role}
            </p>
            <p>
              <span className="font-semibold">User Email:</span> {user.email}
            </p>
          </>
        )}
        <p>
          <span className="font-semibold">LocalStorage Token:</span>{' '}
          {localStorage.getItem('token') ? 'Exists' : 'None'}
        </p>
        <p>
          <span className="font-semibold">LocalStorage User:</span>{' '}
          {localStorage.getItem('user') ? 'Exists' : 'None'}
        </p>
      </div>
    </div>
  )
}

export default AuthDebug
