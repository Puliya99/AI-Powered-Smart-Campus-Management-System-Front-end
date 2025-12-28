import axiosInstance from './api/axios.config';
import { ENDPOINTS } from '../config/api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    registrationNumber: string;
  };
  token: string;
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, credentials);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(ENDPOINTS.REGISTER, data);
      
      if (response.data.status === 'success') {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ME);
      
      if (response.data.status === 'success') {
        return response.data.data.user;
      }
      
      throw new Error(response.data.message || 'Failed to fetch user');
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to fetch user'
      );
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(ENDPOINTS.LOGOUT);
      this.clearAuth();
    } catch (error) {
      // Clear auth even if API call fails
      this.clearAuth();
    }
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get stored user
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();