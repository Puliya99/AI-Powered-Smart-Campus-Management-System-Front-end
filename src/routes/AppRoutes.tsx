import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'


// Lazy load pages for better performance
const Login = React.lazy(() => import('../pages/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'))
const NotFound = React.lazy(() => import('../pages/NotFound'))


// Admin pages
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'))
const StudentsPage = React.lazy(() => import('../pages/admin/StudentPage'))
const ProgramsPage = React.lazy(() => import('../pages/admin/ProgramsPage'))
const ModulesPage = React.lazy(() => import('../pages/admin/ModulePage'))
const LecturerPage = React.lazy(() => import('../pages/admin/LecturerPage'))
const BatchPage = React.lazy(() => import('../pages/admin/BatchPage'))
const SchedulePage = React.lazy(() => import('../pages/admin/SchedulesPage'))
const CentersPage = React.lazy(() => import('../pages/admin/CentersPage'))

// Student pages
const StudentDashboard = React.lazy(
  () => import('../pages/student/StudentDashboard')
)

// Lecturer pages
const LecturerDashboard = React.lazy(
  () => import('../pages/lecturer/LecturerDashboard')
)
const AttendancePage = React.lazy(
  () => import('../pages/lecturer/AttendancePage')
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
        {/* Public Routes - Redirect to dashboard if logged in */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Admin Routes - Only accessible by ADMIN */}
        <Route path="/admin">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="programs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ProgramsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ModulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="lecturers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LecturerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="batches"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="schedule"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute allowedRoles={['ADMIN','LECTURER']}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="centers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CentersPage />
              </ProtectedRoute>
            }
          />
          {/* Add more admin routes */}
        </Route>

        {/* Student Routes - Only accessible by STUDENT */}
        <Route path="/student">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Navigate to="/student/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add more student routes */}
        </Route>

        {/* Lecturer Routes - Only accessible by LECTURER */}
        <Route path="/lecturer">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <Navigate to="/lecturer/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add more lecturer routes */}
        </Route>

        {/* Staff Routes - Only accessible by USER (staff) */}
        <Route path="/user">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Navigate to="/user/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          {/* Add more staff routes */}
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  )
}

export default AppRoutes
