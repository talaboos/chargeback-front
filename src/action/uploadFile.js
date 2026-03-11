'use server';

import { Files } from '@/services/api/files';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const uploadFile = withAuthToken(async (token, binaryData, filename, mimeType) => {
  if (!token) {
    return null;
  }

  const files = new Files();

  return await files.uploadFile(token, binaryData, filename, mimeType);
});

export default uploadFile;
