import axiosInstance from './api/axios.config';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface NotificationResponse {
  status: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const notificationService = {
  // Get current user's notifications
  getMyNotifications: async (page = 1, limit = 20, isRead?: boolean) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (isRead !== undefined) {
      params.append('isRead', isRead.toString());
    }
    const response = await axiosInstance.get<NotificationResponse>(`/notifications/my-notifications?${params}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await axiosInstance.get<{ status: string; data: { count: number } }>('/notifications/unread-count');
    return response.data;
  },

  // Mark a notification as read
  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch<{ status: string; message: string }>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.patch<{ status: string; message: string }>('/notifications/read-all');
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (id: string) => {
    const response = await axiosInstance.delete<{ status: string; message: string }>(`/notifications/${id}`);
    return response.data;
  },

  // Send notification (Admin/Staff only)
  sendNotification: async (data: {
    userIds: string[];
    title: string;
    message: string;
    type?: string;
    link?: string;
  }) => {
    const response = await axiosInstance.post<{ status: string; message: string }>('/notifications/send', data);
    return response.data;
  },
};

export default notificationService;
