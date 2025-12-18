import { NextResponse } from 'next/server';

import { withAuthentication } from '@/middlewares/withAuthentication';

import { Api } from '@/services/api';

export const POST = withAuthentication(async (req, res, token) => {
  const requestData = await req.formData();
  const socket_id = requestData.get('socket_id');
  const channel_name = requestData.get('channel_name');

  const api = new Api();

  const data = await api.pusherAuth(token, { socket_id, channel_name });

  if (!data) {
    return NextResponse.json(
      { error: 'Failed to auth pusher' },
      { status: 403 },
    );
  }

  return NextResponse.json(data);
});
