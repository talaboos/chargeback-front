'use server';

import { Chats } from '@/services/api/chats';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const sendMessage = withAuthToken(async (token, formData) => {
  if (!token) {
    return null;
  }

  const api = new Chats();

  const data = await api.sendMessage(token, formData);

  return data;
});

export default sendMessage;
