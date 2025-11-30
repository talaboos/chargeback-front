'use server';

import { Login } from '@/services/api/login';

export const checkAuth = async (query) => {
  const login = new Login();
  const data = await login.checkAuth(query);

  if (!data) {
    return null;
  }

  return data;
};

export default checkAuth;
