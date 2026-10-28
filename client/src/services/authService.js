import { api } from '../utils/api';

export async function registerUser(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

export async function verifyEmail(token) {
  const { data } = await api.post('/api/auth/verify-email', { token });
  return data;
}

export async function resendVerificationEmail(email) {
  const { data } = await api.post('/api/auth/resend-verification', { email });
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/api/auth/forgot-password', { email });
  return data;
}

export async function resetPassword({ token, password }) {
  const { data } = await api.post('/api/auth/reset-password', { token, password });
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/api/auth/login', payload);
  return data.user;
}

export async function logoutUser() {
  await api.post('/api/auth/logout');
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/api/auth/me');
  return data.user;
}
