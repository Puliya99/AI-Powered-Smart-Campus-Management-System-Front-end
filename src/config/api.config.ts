export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
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

  // Students
  STUDENTS: '/students',
  STUDENT_BY_ID: (id: string) => `/students/${id}`,

  // Lecturers
  LECTURERS: '/lecturers',
  LECTURER_BY_ID: (id: string) => `/lecturers/${id}`,

  // Programs
  PROGRAMS: '/programs',
  PROGRAM_BY_ID: (id: string) => `/programs/${id}`,

  // Add more endpoints as needed
}
