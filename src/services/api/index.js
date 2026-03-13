import { getHeaders } from '@/utils/api';
import { requestJson } from '@/utils/requestJson';

export class Api {
  get baseUrl() {
    if (typeof window === 'undefined') {
      return process.env.API_BASE_URL_INTERNAL || process.env.NEXT_PUBLIC_API_BASE_URL;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

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
