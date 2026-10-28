import { api } from '../utils/api';
import { AUDIT_PAGE_SIZE, USERS_PAGE_SIZE } from '../constants/pagination';

export async function fetchAdminUsers(page = 1) {
  const { data } = await api.get('/api/admin/users', { params: { page, limit: USERS_PAGE_SIZE } });
  return data;
}

export async function updateAdminUser(userId, payload) {
  const { data } = await api.patch(`/api/admin/users/${userId}`, payload);
  return data.user;
}

export async function deleteAdminUser(userId) {
  const { data } = await api.delete(`/api/admin/users/${userId}`);
  return data;
}

export async function fetchAdminAudit(page = 1) {
  const { data } = await api.get('/api/admin/audit', { params: { page, limit: AUDIT_PAGE_SIZE } });
  return data;
}
