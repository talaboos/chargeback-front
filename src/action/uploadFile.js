'use server';

import { Files } from '@/services/api/files';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const uploadFile = withAuthToken(async (token, formData) => {
  if (!token) {
    return null;
  }

  const files = new Files();

  const res = await files.uploadFile(token, formData);

  return res;
});

export default uploadFile;
