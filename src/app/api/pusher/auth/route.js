import Pusher from 'pusher';

import { withAuthentication } from '@/middlewares/withAuthentication';

const pusherServer = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  useTLS: true,
});

export const POST = withAuthentication(async (req, res, token) => {
  try {
    const requestData = await req.formData();
    const socket_id = requestData.get('socket_id');
    const channel_name = requestData.get('channel_name');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Failed to auth pusher' }), {
        status: 403,
      });
    }

    const auth = pusherServer.authorizeChannel(socket_id, channel_name);

    return new Response(JSON.stringify(auth), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Pusher error', error);

    return new Response(JSON.stringify({ error: 'Failed to auth pusher 5' }), {
      status: 403,
    });
  }
});
