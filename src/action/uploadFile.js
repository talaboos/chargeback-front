'use server';

import { Files } from '@/services/api/files';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const uploadFile = withAuthToken(async (token, formData) => {
  if (!token) {
    return null;
  }

  const files = new Files();

  return await files.uploadFile(token, formData);
});

export default uploadFile;
