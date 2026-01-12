import axiosInstance from './api/axios.config';

const reportService = {
  getEnrollmentReport: async (centerId?: string) => {
    const params = new URLSearchParams();
    if (centerId) params.append('centerId', centerId);
    const response = await axiosInstance.get(`/reports/enrollment?${params.toString()}`);
    return response.data;
  },

  getPaymentReport: async (startDate?: string, endDate?: string, centerId?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (centerId) params.append('centerId', centerId);
    const response = await axiosInstance.get(`/reports/payment?${params.toString()}`);
    return response.data;
  },

  getAttendanceReport: async (batchId?: string, centerId?: string) => {
    const params = new URLSearchParams();
    if (batchId) params.append('batchId', batchId);
    if (centerId) params.append('centerId', centerId);
    const response = await axiosInstance.get(`/reports/attendance?${params.toString()}`);
    return response.data;
  },

  getReportStats: async (centerId?: string) => {
    const params = new URLSearchParams();
    if (centerId) params.append('centerId', centerId);
    const response = await axiosInstance.get(`/reports/stats?${params.toString()}`);
    return response.data;
  },
};

export default reportService;
