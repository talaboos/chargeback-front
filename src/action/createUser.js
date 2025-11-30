'use server';

import { Login } from '@/services/api/login';

export const createUser = async (query) => {
  const login = new Login();
  const data = await login.registerAuth(query);

  if (!data) {
    return null;
  }

  return data;
};

export default createUser;
