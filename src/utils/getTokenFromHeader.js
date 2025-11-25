import { headers, cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';

export const getTokenFromHeader = async () => {
  const cook = await cookies();
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(cook.getAll().map((c) => [c.name, c.value])),
  };
  const { token } = await getToken({ req });

  return token;
};

export default getTokenFromHeader;
