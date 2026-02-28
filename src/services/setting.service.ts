import axiosInstance from './api/axios.config';

export interface Setting {
  id: string;
  key: string;
  value: string;
  group: string;
  description: string;
  type: string;
}

const getAllSettings = async (group?: string) => {
  const response = await axiosInstance.get(`/settings${group ? `?group=${group}` : ''}`);
  return response.data;
};

const getSettingByKey = async (key: string) => {
  const response = await axiosInstance.get(`/settings/${key}`);
  return response.data;
};

const upsertSetting = async (settingData: Partial<Setting>) => {
  const response = await axiosInstance.post('/settings', settingData);
  return response.data;
};

const updateMultipleSettings = async (settings: { key: string; value: string }[]) => {
  const response = await axiosInstance.put('/settings/bulk', { settings });
  return response.data;
};

const deleteSetting = async (id: string) => {
  const response = await axiosInstance.delete(`/settings/${id}`);
  return response.data;
};

const settingService = {
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  updateMultipleSettings,
  deleteSetting,
};

export default settingService;
