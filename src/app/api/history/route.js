import { NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';
import { GPT } from '@/services/api/gpt';

export async function GET(req) {
  const data = await getToken({ req });

  if (!data || !data.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatId = data.chatId;

  if (!chatId) {
    return NextResponse.json({ error: 'No chat found' }, { status: 400 });
  }

  const api = new GPT();
  const result = await api.getLastResult(data.token, chatId);

  if (!result) {
    return NextResponse.json({ lastResultId: null });
  }

  const messages = result.data || result;
  const items = Array.isArray(messages) ? messages : [];

  // Find the last AI message that has a parent_id (response to user upload)
  const lastAiMessage = items.find(
    (msg) => msg.sender_type === 'ai' && msg.parent_id,
  );

  if (!lastAiMessage) {
    return NextResponse.json({ lastResultId: null });
  }

  return NextResponse.json({ lastResultId: lastAiMessage.parent_id });
}
