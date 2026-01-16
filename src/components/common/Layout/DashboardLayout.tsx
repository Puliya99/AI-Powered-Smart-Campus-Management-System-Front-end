import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import notificationService, { Notification } from '../../../services/notification.service'
import { formatDistanceToNow } from 'date-fns'
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
  Video,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 60000) // Poll every minute
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error('Failed to fetch unread count', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getMyNotifications(1, 5)
      setNotifications(response.data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    }
  }

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications()
    }
    setShowNotifications(!showNotifications)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setUnreadCount((prev) => Math.max(0, prev - 1))
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

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
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Centers', href: '/admin/centers', icon: Building2 },
        { name: 'Programs', href: '/admin/programs', icon: BookOpen },
        { name: 'Modules', href: '/admin/modules', icon: FileText },
        { name: 'Batches', href: '/admin/batches', icon: Users },
        { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
        { name: 'Payments', href: '/admin/payments', icon: DollarSign },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Performance', href: '/admin/performance', icon: Award },
        { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
      ],
      student: [
        {
          name: 'Dashboard',
          href: '/student/dashboard',
          icon: LayoutDashboard,
        },
        { name: 'My Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Schedule', href: '/student/schedule', icon: Calendar },
        { name: 'Materials', href: '/student/materials', icon: FileText },
        {
          name: 'Online Classes',
          href: '/student/online-classes',
          icon: Video,
        },
        { name: 'Online Tests', href: '/student/quizzes', icon: ClipboardList },
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
        { name: 'My Classes', href: '/lecturer/classes', icon: BookOpen },
        { name: 'Schedule', href: '/lecturer/schedule', icon: Calendar },
        {
          name: 'Attendance',
          href: '/lecturer/attendance',
          icon: ClipboardList,
        },
        { name: 'Materials', href: '/lecturer/materials', icon: FileText },
        {
          name: 'Online Classes',
          href: '/lecturer/online-classes',
          icon: Video,
        },
        {
          name: 'Online Tests',
          href: '/lecturer/quizzes',
          icon: ClipboardList,
        },
        { name: 'Assignments', href: '/lecturer/assignments', icon: FileText },
        { name: 'Results', href: '/lecturer/results', icon: Award },
        { name: 'Performance', href: '/lecturer/performance', icon: Award },
        { name: 'Feedback', href: '/lecturer/feedback', icon: MessageSquare },
      ],
      user: [
        { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Students', href: '/user/students', icon: Users },
        { name: 'Lecturers', href: '/user/lecturers', icon: UserCircle },
        { name: 'Enrollment', href: '/user/enrollment', icon: ClipboardList },
        { name: 'Programs', href: '/user/programs', icon: BookOpen },
        { name: 'Modules', href: '/user/modules', icon: FileText },
        { name: 'Batches', href: '/user/batches', icon: Users },
        { name: 'Centers', href: '/user/centers', icon: Building2 },
        { name: 'Schedule', href: '/user/schedule', icon: Calendar },
        { name: 'Payments', href: '/user/payments', icon: DollarSign },
        { name: 'Reports', href: '/user/reports', icon: FileText },
        { name: 'Feedback', href: '/user/feedback', icon: MessageSquare },
      ],
    }

    return navItems[role || 'student'] || navItems.student
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Smart Campus
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Theme Switcher */}
              <button onClick={toggleTheme}>
                {theme === 'light' ? <Moon /> : <Sun />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleToggleNotifications}
                  className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <button
                        onClick={() => {
                          notificationService.markAllAsRead().then(() => {
                            setUnreadCount(0)
                            setNotifications(
                              notifications.map((n) => ({ ...n, isRead: true }))
                            )
                          })
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                              !notification.isRead
                                ? 'bg-primary-50/30 dark:bg-primary-900/10'
                                : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4
                                className={`text-sm font-medium ${
                                  !notification.isRead
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className="w-2 h-2 bg-primary-600 rounded-full mt-1.5"
                                  title="Mark as read"
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] text-gray-400">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                              {notification.link && (
                                <Link
                                  to={notification.link}
                                  className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline"
                                  onClick={() => setShowNotifications(false)}
                                >
                                  View Details
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link
                      to={`/${user?.role?.toLowerCase()}/notifications`}
                      className="block px-4 py-2 text-center text-xs text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Notifications
                    </Link>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <Link
                      to={`/${user?.role?.toLowerCase()}/profile`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to={`/${user?.role?.toLowerCase()}/notifications`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Link>
                    <Link
                      to={`/${user?.role?.toLowerCase()}/settings`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
