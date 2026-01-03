export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  HEADERS: {
    'Content-Type': 'application/json',
  },
}

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',

  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,

  // Lecturers
  LECTURERS: '/lecturers',
  LECTURER_BY_ID: (id: string) => `/lecturers/${id}`,

  // Programs
  PROGRAMS: '/programs',
  PROGRAM_BY_ID: (id: string) => `/programs/${id}`,

  // Modules
  MODULES: '/modules',
  MODULE_BY_ID: (id: string) => `/modules/${id}`,

  // Batches
  BATCHES: '/batches',
  BATCH_BY_ID: (id: string) => `/batches/${id}`,

  // Attendance
  ATTENDANCE: '/attendance',
  MARK_ATTENDANCE: '/attendance/mark',

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id: string) => `/payments/${id}`,

  // Assignments
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_BY_ID: (id: string) => `/assignments/${id}`,

  // Results
  RESULTS: '/results',
  RESULT_BY_ID: (id: string) => `/results/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
}
