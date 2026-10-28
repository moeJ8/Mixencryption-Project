import { api } from '../utils/api';

/**
 * @param {File} file
 * @param {{ onUploadProgress?: (uploadPercent: number) => void, onUploadBytesComplete?: () => void }} [handlers]
 */
export async function uploadProfileAvatar(file, handlers = {}) {
  const { onUploadProgress, onUploadBytesComplete } = handlers;
  const formData = new FormData();
  formData.append('avatar', file);
  let bytesComplete = false;

  const { data } = await api.post('/api/users/me/avatar', formData, {
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

export async function removeProfileAvatar() {
  const { data } = await api.delete('/api/users/me/avatar');
  return data;
}
