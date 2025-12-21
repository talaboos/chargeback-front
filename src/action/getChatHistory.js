'use server';

import { Chats } from '@/services/api/chats';
import { withAuthToken } from '@/middlewares/withAuthToken';

export const getChatHistory = withAuthToken(async (token, id) => {
  if (!token || !id) {
    return null;
  }

  const api = new Chats();

  const data = await api.getHistoryChat(token, id);

  console.log('0000', data);

  if (!data) {
    return null;
  }

  return data;
});

export default getChatHistory;
