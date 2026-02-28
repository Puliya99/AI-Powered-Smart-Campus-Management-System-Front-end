import axiosInstance from './api/axios.config';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  title: string;
  firstName: string;
  lastName: string;
  nameWithInitials: string;
  gender: string;
  dateOfBirth: string;
  nic: string;
  address: string;
  mobileNumber: string;
  homeNumber?: string;
  profilePic?: string;
  registrationNumber: string;
  isActive: boolean;
  center?: {
    id: string;
    centerName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const userService = {
  getAllUsers: async (params?: any) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },
};

export default userService;
