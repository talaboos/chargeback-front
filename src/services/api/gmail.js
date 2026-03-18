import { Api } from '@/services/api';
import REQUEST_URL from '@/constants/requestUri';

export class GmailApi extends Api {
  async connect(token) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}gmail/connect`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }

  async status(token) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}gmail/status`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }

  async disconnect(token) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}gmail/disconnect`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }

  async scan(token) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}gmail/scan`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }
}

export default GmailApi;
