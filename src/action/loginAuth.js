'use server';

import { Login } from '@/services/api/login';

export const loginAuth = async (query) => {
  const login = new Login();
  const data = await login.loginAuth(query);

  if (!data) {
    return { status: 'error', message: 'Something went wrong. Please try again.' };
  }

  return data;
};

export default loginAuth;
