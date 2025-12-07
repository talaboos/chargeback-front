import { NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export const withAuthentication =
  (handler) =>
  async (req, res, ...rest) => {
    const data = await getToken({ req });

    if (!data || !data.token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, res, data.token, ...rest);
  };
