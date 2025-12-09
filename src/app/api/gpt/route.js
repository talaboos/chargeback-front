import { NextResponse } from 'next/server';

import { withAuthentication } from '@/middlewares/withAuthentication';
import { GPT } from '@/services/api/gpt';

export const GET = withAuthentication(async (req, res, token) => {
  const id = req?.nextUrl?.searchParams.get('id');
  const api = new GPT();
  const { success, status, data } = await api.screenResult(token, id);

  if (!success) {
    return NextResponse.json({ error: 'Bad request' }, { status: 500 });
  }

  return NextResponse.json({ data, status });
});
