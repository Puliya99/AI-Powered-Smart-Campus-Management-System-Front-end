import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Lazy load pages for better performance
const Login = React.lazy(() => import('../pages/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))
const NotFound = React.lazy(() => import('../pages/NotFound'))

// Admin pages
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'))

// Student pages
const StudentDashboard = React.lazy(
  () => import('../pages/student/StudentDashboard')
)

// Lecturer pages
const LecturerDashboard = React.lazy(
  () => import('../pages/lecturer/LecturerDashboard')
)

// Staff pages
const StaffDashboard = React.lazy(() => import('../pages/staff/StaffDashboard'))

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* Add more admin routes */}
        </Route>

        {/* Student Routes */}
        <Route path="/student">
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          {/* Add more student routes */}
        </Route>

        {/* Lecturer Routes */}
        <Route path="/lecturer">
          <Route
            index
            element={<Navigate to="/lecturer/dashboard" replace />}
          />
          <Route path="dashboard" element={<LecturerDashboard />} />
          {/* Add more lecturer routes */}
        </Route>

        {/* Staff Routes */}
        <Route path="/staff">
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          {/* Add more staff routes */}
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  )
}

export default AppRoutes
