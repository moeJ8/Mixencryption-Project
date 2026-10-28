import { api } from '../utils/api';
import { AUDIT_PAGE_SIZE, USERS_PAGE_SIZE } from '../constants/pagination';

export async function fetchAdminUsers(page = 1) {
  const { data } = await api.get('/api/admin/users', { params: { page, limit: USERS_PAGE_SIZE } });
  return data;
}

export async function fetchAdminUser(userId) {
  const { data } = await api.get(`/api/admin/users/${userId}`);
  return data.user;
}

export async function fetchAdminUserActivity(userId, page = 1) {
  const { data } = await api.get(`/api/admin/users/${userId}/activity`, {
    params: { page, limit: AUDIT_PAGE_SIZE },
  });
  return data;
}

/**
 * @param {string} userId
 * @param {File} file
 * @param {{ onUploadProgress?: (uploadPercent: number) => void, onUploadBytesComplete?: () => void }} [handlers]
 */
export async function uploadAdminUserAvatar(userId, file, handlers = {}) {
  const { onUploadProgress, onUploadBytesComplete } = handlers;
  const formData = new FormData();
  formData.append('avatar', file);
  let bytesComplete = false;

  const { data } = await api.post(`/api/admin/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const uploadPercent = Math.min(100, Math.round((event.loaded / event.total) * 100));
      onUploadProgress?.(uploadPercent);
      if (event.loaded >= event.total && !bytesComplete) {
        bytesComplete = true;
        onUploadBytesComplete?.();
      }
    },
  });
  return data;
}

export async function removeAdminUserAvatar(userId) {
  const { data } = await api.delete(`/api/admin/users/${userId}/avatar`);
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
