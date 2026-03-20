'use client';

import { useState, useCallback } from 'react';

import Communication from '@/components/Room/Сommunication';
import Message from '@/components/Room/Message';

export default function ChatRoom({ data, user, chatId }) {
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  const onMessageSent = useCallback((content) => {
    setOptimisticMessages((prev) => [
      ...prev,
      {
        id: `optimistic-${Date.now()}`,
        content,
        sender_type: 'user',
        message_type: 'text',
      },
    ]);
  }, []);

  const onPusherMessage = useCallback((message) => {
    // When real message arrives via Pusher, clear matching optimistic message
    setOptimisticMessages((prev) =>
      prev.filter((m) => m.content !== message.content)
    );
  }, []);

  return (
    <>
      <Communication
        data={data}
        user={user}
        optimisticMessages={optimisticMessages}
        onPusherMessage={onPusherMessage}
      />
      <Message id={chatId} onMessageSent={onMessageSent} />
    </>
  );
}
