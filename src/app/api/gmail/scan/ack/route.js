import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { Api } from '@/services/api';
import REQUEST_URL from '@/constants/requestUri';

export const POST = withAuthentication(async (req, res, token) => {
  const api = new Api();
  const { ok } = await api.callAsync(`${REQUEST_URL}gmail/scan/ack`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!ok) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }

  return NextResponse.json({ status: 'ok' });
});
