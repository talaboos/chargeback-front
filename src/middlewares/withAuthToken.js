import { getTokenFromHeader } from '@/utils/getTokenFromHeader';

export const withAuthToken =
  (handler) =>
  async (formData, ...rest) => {
    const token = await getTokenFromHeader();

    if (!token) {
      return { error: 'auth', message: 'Session expired. Please log in again.' };
    }

    return handler(token, formData, ...rest);
  };
