import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { SubscriptionsApi } from '@/services/api/subscriptions';

export const PUT = withAuthentication(async (req, context, token) => {
  const { id } = await context.params;
  const body = await req.json();
  const api = new SubscriptionsApi();
  const result = await api.update(token, id, body);

  if (!result) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }

  return NextResponse.json(result);
});

export const DELETE = withAuthentication(async (req, context, token) => {
  const { id } = await context.params;
  const api = new SubscriptionsApi();
  const result = await api.destroy(token, id);

  if (!result) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }

  return NextResponse.json(result);
});
