import { Api } from '@/services/api';

import REQUEST_URL from '@/constants/requestUri';

export class Files extends Api {
  async uploadFile(token, formData) {
    const { ok, data } = await this.callAsync(`${REQUEST_URL}files/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!ok) {
      return null;
    }

    return data;
  }
}

export default Files;
