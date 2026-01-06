import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  UserCircle,
  Bell,
  Search,
  ChevronDown,
  Award,
  CreditCard,
  MessageSquare,
  Building2,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation items based on role
  const getNavigationItems = () => {
    const role = user?.role?.toLowerCase()

    const navItems: Record<string, any[]> = {
      admin: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Lecturers', href: '/admin/lecturers', icon: UserCircle },
        { name: 'Centers', href: '/admin/centers', icon: Building2 },
        { name: 'Programs', href: '/admin/programs', icon: BookOpen },
        { name: 'Modules', href: '/admin/modules', icon: FileText },
        { name: 'Batches', href: '/admin/batches', icon: Users },
        { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
        { name: 'Attendance', href: '/admin/attendance', icon: ClipboardList },
        { name: 'Payments', href: '/admin/payments', icon: DollarSign },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ],
      student: [
        {
          name: 'Dashboard',
          href: '/student/dashboard',
          icon: LayoutDashboard,
        },
        { name: 'My Profile', href: '/student/profile', icon: UserCircle },
        { name: 'My Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Schedule', href: '/student/schedule', icon: Calendar },
        {
          name: 'Attendance',
          href: '/student/attendance',
          icon: ClipboardList,
        },
        { name: 'Assignments', href: '/student/assignments', icon: FileText },
        { name: 'Results', href: '/student/results', icon: Award },
        { name: 'Payments', href: '/student/payments', icon: CreditCard },
        { name: 'Feedback', href: '/student/feedback', icon: MessageSquare },
      ],
      lecturer: [
        {
          name: 'Dashboard',
          href: '/lecturer/dashboard',
          icon: LayoutDashboard,
        },
        { name: 'My Profile', href: '/lecturer/profile', icon: UserCircle },
        { name: 'My Classes', href: '/lecturer/classes', icon: BookOpen },
        { name: 'Schedule', href: '/lecturer/schedule', icon: Calendar },
        {
          name: 'Attendance',
          href: '/lecturer/attendance',
          icon: ClipboardList,
        },
        { name: 'Assignments', href: '/lecturer/assignments', icon: FileText },
        { name: 'Results', href: '/lecturer/results', icon: Award },
        { name: 'Materials', href: '/lecturer/materials', icon: FileText },
        { name: 'Performance', href: '/lecturer/performance', icon: Award },
      ],
      user: [
        { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/user/profile', icon: UserCircle },
        { name: 'Students', href: '/user/students', icon: Users },
        { name: 'Enrollment', href: '/user/enrollment', icon: ClipboardList },
        { name: 'Documents', href: '/user/documents', icon: FileText },
        { name: 'Reports', href: '/user/reports', icon: FileText },
        { name: 'Settings', href: '/user/settings', icon: Settings },
      ],
    }

    return navItems[role || 'student'] || navItems.student
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Smart Campus
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-primary-700' : 'text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to={`/${user?.role?.toLowerCase()}/profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to={`/${user?.role?.toLowerCase()}/settings`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
