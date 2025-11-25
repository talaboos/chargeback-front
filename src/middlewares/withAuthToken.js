import { getTokenFromHeader } from '@/utils/getTokenFromHeader';

export const withAuthToken =
  (handler) =>
  async (formData, ...rest) => {
    const token = await getTokenFromHeader();

    if (!token) {
      return null;
    }

    return handler(token, formData, ...rest);
  };
