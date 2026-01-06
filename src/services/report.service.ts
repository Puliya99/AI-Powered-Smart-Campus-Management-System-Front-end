import axiosInstance from './api/axios.config';

const reportService = {
  getEnrollmentReport: async () => {
    const response = await axiosInstance.get('/reports/enrollment');
    return response.data;
  },

  getPaymentReport: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await axiosInstance.get(`/reports/payment?\${params.toString()}`);
    return response.data;
  },

  getAttendanceReport: async (batchId?: string) => {
    const params = new URLSearchParams();
    if (batchId) params.append('batchId', batchId);
    const response = await axiosInstance.get(`/reports/attendance?\${params.toString()}`);
    return response.data;
  },

  getReportStats: async () => {
    const response = await axiosInstance.get('/reports/stats');
    return response.data;
  },
};

export default reportService;
