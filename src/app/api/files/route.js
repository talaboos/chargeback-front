import { NextResponse } from 'next/server';

import { withAuthentication } from '@/middlewares/withAuthentication';
import { Files } from '@/services/api/files';

export const POST = withAuthentication(async (req, res, token) => {
  const { formData } = await req.json();
  const api = new Files();
  const { status, data } = await api.uploadFile(token, formData);

  if (status !== 'success') {
    return NextResponse.json({ error: 'Bad request' }, { status: 500 });
  }

  return NextResponse.json(data);
});
