'use server';

import { Files } from '@/services/api/files';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const uploadFile = withAuthToken(async (token, binaryData, filename, mimeType) => {
  console.log('[uploadFile] called', { hasToken: !!token, filename, mimeType, dataLength: binaryData?.length });

  if (!token) {
    return { error: 'auth', message: 'Session expired. Please log in again.' };
  }

  try {
    const files = new Files();
    const result = await files.uploadFile(token, binaryData, filename, mimeType);
    console.log('[uploadFile] result', JSON.stringify(result)?.substring(0, 200));

    if (!result) {
      return { error: 'upload', message: 'Upload failed. Please try again.' };
    }

    return result;
  } catch (err) {
    console.error('[uploadFile] error', err);
    return { error: 'upload', message: err.message || 'Upload failed' };
  }
});

export default uploadFile;
