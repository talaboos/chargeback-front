import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { SubscriptionsApi } from '@/services/api/subscriptions';

export const GET = withAuthentication(async (req, res, token) => {
  const api = new SubscriptionsApi();
  const result = await api.getAll(token);

  if (!result) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }

  return NextResponse.json(result);
});
