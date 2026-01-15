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
const ReportsPage = React.lazy(() => import('../pages/admin/ReportsPage'))
const SettingsPage = React.lazy(() => import('../pages/admin/SettingsPage'))
const UsersPage = React.lazy(() => import('../pages/admin/UsersPage'))
const ProfilePage = React.lazy(() => import('../pages/common/ProfilePage'))

// Student pages
const StudentDashboard = React.lazy(
  () => import('../pages/student/StudentDashboard')
)
const StudentCoursesPage = React.lazy(
  () => import('../pages/student/StudentCoursesPage')
)
const StudentSchedulePage = React.lazy(
  () => import('../pages/student/StudentSchedulePage')
)
const PaymentsPage = React.lazy(() => import('../pages/admin/PaymentsPage'))

// Lecturer pages
const LecturerDashboard = React.lazy(
  () => import('../pages/lecturer/LecturerDashboard')
)
const LecturerClassesPage = React.lazy(
  () => import('../pages/lecturer/LecturerClassesPage')
)
const LecturerModuleDetailsPage = React.lazy(
  () => import('../pages/lecturer/ModuleDetailsPage')
)
const LectureMaterialsPage = React.lazy(
  () => import('../pages/common/LectureMaterialsPage')
)
const AttendancePage = React.lazy(() => import('../pages/admin/AttendancePage'))
const OnlineClassesPage = React.lazy(
  () => import('../pages/lecturer/OnlineClassesPage')
)
const VideoRoom = React.lazy(() => import('../pages/common/VideoRoom'))

// Quiz pages
const LecturerQuizzesPage = React.lazy(() => import('../pages/lecturer/QuizzesPage'))
const CreateQuizPage = React.lazy(() => import('../pages/lecturer/CreateQuizPage'))
const EditQuizPage = React.lazy(() => import('../pages/lecturer/EditQuizPage'))
const QuizResultsSummaryPage = React.lazy(() => import('../pages/lecturer/QuizResultsSummaryPage'))
const StudentQuizzesPage = React.lazy(() => import('../pages/student/QuizzesPage'))
const QuizAttemptPage = React.lazy(() => import('../pages/student/QuizAttemptPage'))
const QuizResultPage = React.lazy(() => import('../pages/student/QuizResultPage'))
const StudentResultsPage = React.lazy(() => import('../pages/student/StudentResultsPage'))

// Assignment pages
const LecturerAssignmentsPage = React.lazy(() => import('../pages/lecturer/AssignmentsPage'))
const CreateAssignmentPage = React.lazy(() => import('../pages/lecturer/CreateAssignmentPage'))
const EditAssignmentPage = React.lazy(() => import('../pages/lecturer/EditAssignmentPage'))
const AssignmentSubmissionsPage = React.lazy(() => import('../pages/lecturer/AssignmentSubmissionsPage'))
const StudentAssignmentsPage = React.lazy(() => import('../pages/student/AssignmentsPage'))
const ModuleResultsPage = React.lazy(() => import('../pages/lecturer/ModuleResultsPage'))
const LecturePerformancePage = React.lazy(() => import('../pages/lecturer/LecturePerformancePage'))
const LecturerSettingsPage = React.lazy(() => import('../pages/lecturer/LecturerSettingsPage'))
const AdminPerformancePage = React.lazy(() => import('../pages/admin/AdminPerformancePage'))

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
              <ProtectedRoute allowedRoles={['ADMIN']}>
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
          <Route
            path="payments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="performance"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPerformancePage />
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
          <Route
            path="courses"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="schedule"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentSchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="results"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/materials"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <LectureMaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/quizzes"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentQuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentQuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes/:quizId/attempt"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <QuizAttemptPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes/attempts/:attemptId/result"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <QuizResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/assignments"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="materials"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <LectureMaterialsPage />
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
          <Route
            path="classes"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:id"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerModuleDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/materials"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LectureMaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/quizzes"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerQuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/quizzes/create"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <CreateQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes/:quizId/edit"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <EditQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes/:quizId/results"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <QuizResultsSummaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/assignments"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/assignments/create"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <CreateAssignmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="modules/:moduleId/results"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <ModuleResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="results"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <ModuleResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/:assignmentId/edit"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <EditAssignmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/:assignmentId/submissions"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <AssignmentSubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="materials"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LectureMaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quizzes"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerQuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="schedule"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="performance"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturePerformancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="online-classes"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <OnlineClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerSettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Add more lecturer routes */}
        </Route>

        <Route
          path="/video/room/:meetingCode"
          element={
            <ProtectedRoute allowedRoles={['LECTURER', 'STUDENT']}>
              <VideoRoom />
            </ProtectedRoute>
          }
        />

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
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <SettingsPage />
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
