import axiosInstance from './api/axios.config';

export const enrollmentService = {
  getAllEnrollments: async (params: any) => {
    const response = await axiosInstance.get('/enrollments', { params });
    return response.data;
  },

  getEnrollmentById: async (id: string) => {
    const response = await axiosInstance.get(`/enrollments/${id}`);
    return response.data;
  },

  createEnrollment: async (data: any) => {
    const response = await axiosInstance.post('/enrollments', data);
    return response.data;
  },

  updateEnrollment: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/enrollments/${id}`, data);
    return response.data;
  },

  deleteEnrollment: async (id: string) => {
    const response = await axiosInstance.delete(`/enrollments/${id}`);
    return response.data;
  },
};

export default enrollmentService;
