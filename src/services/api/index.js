import { getHeaders } from '@/utils/api';
import { requestJson } from '@/utils/requestJson';

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
}

export default Api;
