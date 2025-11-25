import { getHeaders } from '@/utils/api';
import { requestJson } from '@/utils/requestJson';

import REQUEST_URL from '@/constants/requestUri';

export class Api {
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async callAsync(uri, init) {
    const response = await requestJson(`${this.baseUrl}${uri}`, {
      ...init,
      credentials: 'include',
      headers: {
        ...getHeaders(),
        ...init.headers,
      },
    });

    return response;
  }

  async checkAuth(email) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}auth/check?email=${email}`,
      {
        method: 'GET',
      },
    );

    if (!ok) {
      return null;
    }

    return data;
  }

  async registerAuth(query) {
    const { ok, data } = await this.callAsync(`${REQUEST_URL}auth/register`, {
      method: 'POST',
      body: JSON.stringify(query),
    });

    if (!ok) {
      return null;
    }

    return data;
  }

  async loginAuth(query) {
    const { ok, data } = await this.callAsync(`${REQUEST_URL}auth/login`, {
      method: 'POST',
      body: JSON.stringify(query),
    });

    if (!ok) {
      return null;
    }

    return data;
  }
}

export default Api;
