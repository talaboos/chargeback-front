import { Api } from '@/services/api';

import REQUEST_URL from '@/constants/requestUri';

export class Files extends Api {
  async uploadFile(token, binaryData, filename, mimeType) {
    const params = new URLSearchParams();
    if (filename) params.set('filename', filename);
    if (mimeType) params.set('mime_type', mimeType);

    const url = `${REQUEST_URL}files/upload?${params.toString()}`;
    const { ok, data } = await this.callAsync(url, {
      method: 'POST',
      headers: {
        'Content-Type': mimeType || 'application/octet-stream',
        Authorization: `Bearer ${token}`,
      },
      body: binaryData,
    });

    if (!ok) {
      return null;
    }

    return data;
  }
}

export default Files;
