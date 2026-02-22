import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Save,
  Loader2,
  Fingerprint,
  Key,
  Trash2,
  Plus,
  RefreshCw,
  Smartphone,
  Copy,
  CheckCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import webauthnService from '../../services/webauthn.service';
import { startRegistration } from '@simplewebauthn/browser';

interface Credential {
  id: string;
  deviceName: string;
  credentialDeviceType: string;
  createdAt: string;
}

const StudentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // Fingerprint & Passkey state
  const [passkey, setPasskey] = useState<number | null>(null);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [showDeviceNameInput, setShowDeviceNameInput] = useState(false);
  const [passkeyCopied, setPasskeyCopied] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      assignmentReminders: true,
      examNotifications: true,
      campusNews: true,
    },
    privacy: {
      showProfilePic: true,
      showEmail: false,
      publicGrades: false,
    },
    preferences: {
      language: 'English',
      timezone: 'UTC+5:30',
      theme: 'light',
    }
  });

  useEffect(() => {
    if (activeTab === 'fingerprint') {
      fetchPasskey();
      fetchCredentials();
    }
  }, [activeTab]);

  const fetchPasskey = async () => {
    try {
      const res = await webauthnService.getMyPasskey();
      setPasskey(res.data.data.passkey);
    } catch {
      // No passkey yet
    }
  };

  const fetchCredentials = async () => {
    setCredentialsLoading(true);
    try {
      const res = await webauthnService.getCredentials();
      setCredentials(res.data.data.credentials || []);
    } catch {
      toast.error('Failed to fetch credentials');
    } finally {
      setCredentialsLoading(false);
    }
  };

  const handleGeneratePasskey = async () => {
    setPasskeyLoading(true);
    try {
      const res = await webauthnService.generatePasskey();
      setPasskey(res.data.data.passkey);
      toast.success('Passkey generated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate passkey');
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleCopyPasskey = () => {
    if (passkey) {
      navigator.clipboard.writeText(passkey.toString());
      setPasskeyCopied(true);
      toast.success('Passkey copied to clipboard');
      setTimeout(() => setPasskeyCopied(false), 2000);
    }
  };

  const handleRegisterFingerprint = async () => {
    setRegistering(true);
    try {
      // Step 1: Get registration options
      const startRes = await webauthnService.registerStart();
      const options = startRes.data.data.options;

      // Step 2: Trigger browser biometric prompt
      const registrationResponse = await startRegistration({ optionsJSON: options });

      // Step 3: Send response to backend
      await webauthnService.registerFinish(registrationResponse, deviceName || 'My Device');

      toast.success('Fingerprint registered successfully!');
      setShowDeviceNameInput(false);
      setDeviceName('');
      fetchCredentials();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        toast.error('Fingerprint registration was cancelled');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Registration failed');
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    if (!confirm('Are you sure you want to remove this fingerprint?')) return;
    try {
      await webauthnService.deleteCredential(credentialId);
      toast.success('Fingerprint removed');
      fetchCredentials();
    } catch {
      toast.error('Failed to remove fingerprint');
    }
  };

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        //@ts-ignore
        ...prev[category],
        //@ts-ignore
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Settings updated successfully');
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'fingerprint', name: 'Fingerprint & Passkey', icon: Fingerprint },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'account', name: 'Account Security', icon: Lock },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your academic preferences and account settings</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                    <select
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({...settings, preferences: {...settings.preferences, language: e.target.value}})}
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                    <select
                      className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={settings.preferences.timezone}
                      onChange={(e) => setSettings({...settings, preferences: {...settings.preferences, timezone: e.target.value}})}
                    >
                      <option>UTC+5:30 (India/Sri Lanka)</option>
                      <option>UTC+0:00 (GMT)</option>
                      <option>UTC-5:00 (EST)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fingerprint' && (
              <div className="space-y-8 max-w-2xl">
                {/* Passkey Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                    <Key className="w-5 h-5 text-blue-500" />
                    Attendance Passkey
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Your 6-digit passkey is used to mark attendance at classroom kiosks. Enter it on the kiosk tablet to record your entry and exit.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    {passkey ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Passkey</p>
                          <div className="flex items-center gap-3">
                            <span className="text-4xl font-mono font-bold tracking-[0.3em] text-gray-900 dark:text-white">
                              {passkey}
                            </span>
                            <button
                              onClick={handleCopyPasskey}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="Copy passkey"
                            >
                              {passkeyCopied ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleGeneratePasskey}
                          disabled={passkeyLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
                        >
                          {passkeyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          Regenerate
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Key className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No passkey generated yet</p>
                        <button
                          onClick={handleGeneratePasskey}
                          disabled={passkeyLoading}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {passkeyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          Generate Passkey
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* WebAuthn Fingerprint Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                    <Fingerprint className="w-5 h-5 text-green-500" />
                    Registered Fingerprints
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Register your fingerprint for biometric attendance verification on supported devices (laptops, phones with fingerprint sensors).
                  </p>

                  {/* Register Button / Device Name Input */}
                  {showDeviceNameInput ? (
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="text"
                        placeholder="Device name (e.g., My Phone)"
                        value={deviceName}
                        onChange={e => setDeviceName(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={handleRegisterFingerprint}
                        disabled={registering}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                        Scan
                      </button>
                      <button
                        onClick={() => { setShowDeviceNameInput(false); setDeviceName(''); }}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeviceNameInput(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
                    >
                      <Plus className="w-4 h-4" />
                      Register Fingerprint
                    </button>
                  )}

                  {/* Credentials List */}
                  {credentialsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : credentials.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center">
                      <Fingerprint className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No fingerprints registered yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Register Fingerprint" to add one</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {credentials.map(cred => (
                        <div
                          key={cred.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{cred.deviceName || 'Unknown Device'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Registered {new Date(cred.createdAt).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteCredential(cred.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Remove fingerprint"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive general alerts via email</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'emailAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.emailAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Assignment Reminders</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming assignment deadlines</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'assignmentReminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.assignmentReminders ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.assignmentReminders ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Exam Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts about exam schedules and results</p>
                  </div>
                  <button
                    onClick={() => handleToggle('notifications', 'examNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.examNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.examNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Show Profile Picture</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile picture visible to other students</p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'showProfilePic')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.showProfilePic ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.showProfilePic ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Public Grades</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow your grades to be visible on leaderboards</p>
                  </div>
                  <button
                    onClick={() => handleToggle('privacy', 'publicGrades')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.publicGrades ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.publicGrades ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-start">
                  <Shield className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Account Security</p>
                    <p className="text-sm">To change your password or update security settings, please visit your profile page.</p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/student/profile'}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Go to Profile
                </button>
              </div>
            )}

            {activeTab !== 'fingerprint' && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
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
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettingsPage;
