import { NextResponse } from 'next/server';
import { withAuthentication } from '@/middlewares/withAuthentication';
import { GmailApi } from '@/services/api/gmail';

export const GET = withAuthentication(async (req, res, token) => {
  const api = new GmailApi();
  const result = await api.connect(token);

  if (!result) {
    return NextResponse.json({ error: 'Failed to get connect URL' }, { status: 500 });
  }

  return NextResponse.json(result);
});
