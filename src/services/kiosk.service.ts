import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

// Separate axios instance WITHOUT auth headers for public kiosk endpoints
const kioskAxios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const kioskService = {
  // Scan attendance by 6-digit passkey
  scanByPasskey: (passkey: number) =>
    kioskAxios.post('/kiosk/scan/passkey', { passkey }),

  // Scan attendance by hardware fingerprint ID
  scanByFingerprintId: (fingerprintId: string) =>
    kioskAxios.post('/kiosk/scan/fingerprint', { fingerprintId }),

  // Look up student info by passkey (for display)
  getStudentByPasskey: (passkey: number) =>
    kioskAxios.get(`/kiosk/student/by-passkey/${passkey}`),

  // Start WebAuthn authentication flow
  webauthnAuthStart: (passkey: number) =>
    kioskAxios.post('/kiosk/webauthn/authenticate/start', { passkey }),

  // Finish WebAuthn authentication and mark attendance
  webauthnAuthFinish: (passkey: number, authenticationResponse: any) =>
    kioskAxios.post('/kiosk/webauthn/authenticate/finish', { passkey, authenticationResponse }),

  // Get current/upcoming schedule info
  getCurrentSchedule: (lectureHall?: string) =>
    kioskAxios.get('/kiosk/schedule/current', { params: { lectureHall } }),
};

export default kioskService;
