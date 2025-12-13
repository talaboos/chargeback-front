import { Api } from '@/services/api';

import REQUEST_URL from '@/constants/requestUri';

export class GPT extends Api {
  async screenResult(token, id) {
    const { ok, data } = await this.callAsync(`${REQUEST_URL}ai/result/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!ok) {
      return null;
    }

    return data;
  }
}

export default GPT;
