import { Api } from '@/services/api';
import REQUEST_URL from '@/constants/requestUri';

export class DeviceTokensApi extends Api {
  async register(token, fcmToken, deviceType = 'web') {
    const { ok } = await this.callAsync(
      `${REQUEST_URL}device-tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcm_token: fcmToken, device_type: deviceType }),
      },
    );

    return ok;
  }

  async remove(token, fcmToken) {
    const { ok } = await this.callAsync(
      `${REQUEST_URL}device-tokens`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcm_token: fcmToken }),
      },
    );

    return ok;
  }
}

export default DeviceTokensApi;
