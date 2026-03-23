import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { GmailApi } from '@/services/api/gmail';

export const POST = withAuthentication(async (req, res, token) => {
  const api = new GmailApi();
  const result = await api.scan(token);

  if (!result) {
    return NextResponse.json({ error: 'Failed to scan' }, { status: 500 });
  }

  if (result.error === 'insufficient_permissions') {
    return NextResponse.json(result, { status: 403 });
  }

  return NextResponse.json(result);
});
