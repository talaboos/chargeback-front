import { headers, cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';

export const getTokenFromHeader = async () => {
  const cook = await cookies();
  const req = {
    headers: Object.fromEntries(await headers()),
    cookies: Object.fromEntries(cook.getAll().map((c) => [c.name, c.value])),
  };
  const data = await getToken({ req });

  return data?.token ?? null;
};

export default getTokenFromHeader;
