export const API_CONFIG = {
  // logic: If the URL doesn't end with /api/v1, append it.
  BASE_URL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '') + 
            ((import.meta.env.VITE_API_URL || '').includes('/api/v1') ? '' : '/api/v1'),
            
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
  ATTENDANCE_SCAN: '/attendance/scan',
  ATTENDANCE_STUDENT_REPORT: (studentId: string) => `/attendance/student/${studentId}/report`,

  // Kiosk (public)
  KIOSK_SCAN_PASSKEY: '/kiosk/scan/passkey',
  KIOSK_SCAN_FINGERPRINT: '/kiosk/scan/fingerprint',
  KIOSK_STUDENT_BY_PASSKEY: (passkey: number) => `/kiosk/student/by-passkey/${passkey}`,
  KIOSK_SCHEDULE_CURRENT: '/kiosk/schedule/current',

  // WebAuthn & Passkey
  WEBAUTHN_REGISTER_START: '/students/me/webauthn/register/start',
  WEBAUTHN_REGISTER_FINISH: '/students/me/webauthn/register/finish',
  WEBAUTHN_CREDENTIALS: '/students/me/webauthn/credentials',
  MY_PASSKEY: '/students/me/passkey',
  GENERATE_PASSKEY: '/students/me/passkey/generate',
  FINGERPRINT_STATUS: '/students/fingerprint-status',

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
