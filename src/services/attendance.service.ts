import axiosInstance from './api/axios.config';

const attendanceService = {
  // Get student's own attendance report
  getStudentReport: (studentId: string, params?: { startDate?: string; endDate?: string; moduleId?: string }) =>
    axiosInstance.get(`/attendance/student/${studentId}/report`, { params }),

  // Get attendance stats
  getStats: () =>
    axiosInstance.get('/attendance/stats'),

  // Get schedule attendance
  getScheduleAttendance: (scheduleId: string) =>
    axiosInstance.get(`/attendance/schedule/${scheduleId}`),

  // Mark attendance
  markAttendance: (data: { scheduleId: string; attendanceData: any[] }) =>
    axiosInstance.post('/attendance/mark', data),

  // Get all attendance records
  getAll: (params?: Record<string, any>) =>
    axiosInstance.get('/attendance', { params }),

  // Fingerprint scan
  scanFingerprint: (data: { fingerprintId: string; scheduleId?: string }) =>
    axiosInstance.post('/attendance/scan', data),
};

export default attendanceService;
