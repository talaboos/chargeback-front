'use server';

import { Login } from '@/services/api/login';

export const loginAuth = async (query) => {
  const login = new Login();
  const data = await login.loginAuth(query);

  if (!data) {
    return null;
  }

  return data;
};

export default loginAuth;
