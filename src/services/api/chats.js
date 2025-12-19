import { Api } from '@/services/api';

import REQUEST_URL from '@/constants/requestUri';

export class Chats extends Api {
  async getHistoryChat(token, id) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}chats/${id}/messages/?limit=20&offset=0`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!ok) {
      return null;
    }

    return data;
  }

  async chatMarkRead(token, id) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}chats/${id}/messages/read`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!ok) {
      return null;
    }

    return data;
  }

  async sendMessage(token, formData) {
    const { id } = formData;

    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}chats/${id}/messages/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          ...{ type: 'text' },
        }),
      },
    );

    if (!ok) {
      return null;
    }

    return data;
  }
}

export default Chats;
