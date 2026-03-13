import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { SubscriptionsApi } from '@/services/api/subscriptions';

export const POST = withAuthentication(async (req, res, token, { params }) => {
  const { id } = await params;
  const api = new SubscriptionsApi();
  const result = await api.cancel(token, id);

  if (!result) {
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 });
  }

  return NextResponse.json(result);
});
