'use server';

import { Login } from '@/services/api/login';

export const loginFirebase = async (query) => {
  const login = new Login();
  const data = await login.loginWithFirebase(query);

  if (!data) {
    return null;
  }

  return data;
};

export default loginFirebase;
