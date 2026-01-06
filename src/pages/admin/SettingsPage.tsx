import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/common/Layout/DashboardLayout';
import settingService, { Setting } from '../../services/setting.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const { user } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingService.getAllSettings();
      setSettings(response.data.settings);
    } catch (error) {
      toast.error('Failed to fetch settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleJsonValueChange = (key: string, role: string, checked: boolean) => {
    setSettings(prev => prev.map(s => {
      if (s.key === key) {
        try {
          const currentVal = JSON.parse(s.value);
          currentVal[role] = checked;
          return { ...s, value: JSON.stringify(currentVal) };
        } catch (e) {
          // If not valid JSON, initialize it
          const newVal = { [role]: checked };
          return { ...s, value: JSON.stringify(newVal) };
        }
      }
      return s;
    }));
  };

  const handleSave = async (group: string) => {
    try {
      setSaving(true);
      const settingsToUpdate = settings
        .filter(s => s.group === group)
        .map(s => ({ key: s.key, value: s.value }));
      
      await settingService.updateMultipleSettings(settingsToUpdate);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const groups = Array.from(new Set(settings.map(s => s.group || 'general')))
    .filter(group => {
      if (group === 'user_permission' && user?.role !== 'ADMIN') return false;
      return true;
    });
  if (groups.length === 0 && !loading) groups.push('general');
  
  // If activeTab is not in groups and we have groups, set it to the first group
  useEffect(() => {
    if (groups.length > 0 && !groups.includes(activeTab)) {
      setActiveTab(groups[0]);
    }
  }, [groups]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure global campus management parameters</p>
          </div>
          <button 
            onClick={fetchSettings}
            className="p-2 text-gray-500 hover:text-primary-600 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              {groups.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveTab(group)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === group 
                      ? 'border-b-2 border-primary-600 text-primary-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {group.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="space-y-6 max-w-4xl">
                {settings.filter(s => s.group === activeTab || (!s.group && activeTab === 'general')).map(setting => (
                  <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        {setting.key.split('_').join(' ')}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                    </div>
                    <div className="md:col-span-2">
                      {setting.type === 'boolean' ? (
                        <select
                          value={setting.value}
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="true">Enabled</option>
                          <option value="false">Disabled</option>
                        </select>
                      ) : setting.type === 'json' ? (
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {['ADMIN', 'USER', 'LECTURER', 'STUDENT'].map(role => {
                            let isChecked = false;
                            try {
                              const jsonVal = JSON.parse(setting.value);
                              isChecked = !!jsonVal[role];
                            } catch (e) {}
                            
                            return (
                              <div key={role} className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`${setting.key}-${role}`}
                                  checked={isChecked}
                                  onChange={(e) => handleJsonValueChange(setting.key, role, e.target.checked)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`${setting.key}-${role}`} className="text-sm font-medium text-gray-700">
                                  {role.charAt(0) + role.slice(1).toLowerCase()}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : setting.type === 'text' || setting.type === 'number' ? (
                        <input
                          type={setting.type}
                          value={setting.value}
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <textarea
                          value={setting.value}
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  </div>
                ))}

                {settings.filter(s => s.group === activeTab || (!s.group && activeTab === 'general')).length === 0 && (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No settings found in this group.</p>
                  </div>
                )}

                <div className="pt-6 border-t flex justify-end">
                  <button
                    onClick={() => handleSave(activeTab)}
                    disabled={saving}
                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Info Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">App Version</p>
              <p className="text-base font-medium text-gray-900">1.0.0-stable</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Environment</p>
              <p className="text-base font-medium text-gray-900">Production</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last System Update</p>
              <p className="text-base font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
