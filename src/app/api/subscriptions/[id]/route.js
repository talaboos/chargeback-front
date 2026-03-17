import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { SubscriptionsApi } from '@/services/api/subscriptions';

export const DELETE = withAuthentication(async (req, context, token) => {
  const { id } = await context.params;
  const api = new SubscriptionsApi();
  const result = await api.destroy(token, id);

  if (!result) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }

  return NextResponse.json(result);
});
