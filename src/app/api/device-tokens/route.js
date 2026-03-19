import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { DeviceTokensApi } from '@/services/api/deviceTokens';

export const POST = withAuthentication(async (req, res, token) => {
  const body = await req.json();
  const api = new DeviceTokensApi();
  const ok = await api.register(token, body.fcm_token, body.device_type || 'web');

  if (!ok) {
    return NextResponse.json({ error: 'Failed to register token' }, { status: 500 });
  }

  return NextResponse.json({ status: 'success' });
});

export const DELETE = withAuthentication(async (req, res, token) => {
  const body = await req.json();
  const api = new DeviceTokensApi();
  const ok = await api.remove(token, body.fcm_token);

  if (!ok) {
    return NextResponse.json({ error: 'Failed to remove token' }, { status: 500 });
  }

  return NextResponse.json({ status: 'success' });
});
