import React, { useState } from 'react'
import {
  Settings,
  Bell,
  Lock,
  User,
  Globe,
  Shield,
  Save,
  Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/common/Layout/DashboardLayout'
import toast from 'react-hot-toast'

const LecturerSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      assignmentSubmissions: true,
      classReminders: true,
      announcements: true,
    },
    privacy: {
      showEmail: true,
      showMobile: false,
      publicProfile: true,
    },
    preferences: {
      language: 'English',
      timezone: 'UTC+5:30',
      theme: 'light',
    },
  })

  const handleToggle = (category: string, setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        //@ts-ignore
        ...prev[category],
        //@ts-ignore
        [setting]: !prev[category][setting],
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Settings updated successfully')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'account', name: 'Account Security', icon: Lock },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      value={settings.preferences.language}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            language: e.target.value,
                          },
                        })
                      }
                    >
                      <option>English</option>
                      <option>Sinhala</option>
                      <option>Tamil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timezone
                    </label>
                    <select
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      value={settings.preferences.timezone}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            timezone: e.target.value,
                          },
                        })
                      }
                    >
                      <option>UTC+5:30 (India/Sri Lanka)</option>
                      <option>UTC+0:00 (GMT)</option>
                      <option>UTC-5:00 (EST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive general alerts via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'emailAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.emailAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Assignment Submissions
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when students submit assignments
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('notifications', 'assignmentSubmissions')
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.assignmentSubmissions ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.assignmentSubmissions ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Class Reminders</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive reminders before your scheduled classes
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleToggle('notifications', 'classReminders')
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.classReminders ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.classReminders ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Show Email Address
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow students to see your email address
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'showEmail')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.showEmail ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Show Mobile Number
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow students to see your mobile number
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'showMobile')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.showMobile ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.showMobile ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg flex items-start">
                  <Shield className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Account Security</p>
                    <p className="text-sm">
                      To change your password or update security settings,
                      please visit your profile page.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = '/lecturer/profile')}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Go to Profile
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LecturerSettingsPage
