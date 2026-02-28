import axiosInstance from './api/axios.config';

const webauthnService = {
  // Start WebAuthn fingerprint registration
  registerStart: () =>
    axiosInstance.post('/students/me/webauthn/register/start'),

  // Finish WebAuthn fingerprint registration
  registerFinish: (registrationResponse: any, deviceName?: string) =>
    axiosInstance.post('/students/me/webauthn/register/finish', { registrationResponse, deviceName }),

  // Get registered credentials
  getCredentials: () =>
    axiosInstance.get('/students/me/webauthn/credentials'),

  // Delete a credential
  deleteCredential: (credentialId: string) =>
    axiosInstance.delete(`/students/me/webauthn/credentials/${credentialId}`),

  // Get my passkey
  getMyPasskey: () =>
    axiosInstance.get('/students/me/passkey'),

  // Generate a new passkey
  generatePasskey: () =>
    axiosInstance.post('/students/me/passkey/generate'),
};

export default webauthnService;
