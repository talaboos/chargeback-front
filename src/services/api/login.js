import { Api } from '@/services/api';

import REQUEST_URL from '@/constants/requestUri';

export class Login extends Api {
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

export default Login;
