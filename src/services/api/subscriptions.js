import { Api } from '@/services/api';
import REQUEST_URL from '@/constants/requestUri';

export class SubscriptionsApi extends Api {
  async getAll(token) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}subscriptions`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }

  async cancel(token, id) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}subscriptions/${id}/cancel`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }

  async destroy(token, id) {
    const { ok, data } = await this.callAsync(
      `${REQUEST_URL}subscriptions/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!ok) return null;
    return data;
  }
}

export default SubscriptionsApi;
