'use client';

import { useState } from 'react';
import { sendGTMEvent } from '@next/third-parties/google';

import Input from '@/components/Controls/Input';

import sendMessage from '@/action/sendMessage';

import styles from './message.module.scss';

export default function Message({ id, onMessageSent }) {
  const [typing, setTyping] = useState('');
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    if (!typing.trim()) return;
    const content = typing.trim();
    setSending(true);
    // Show message immediately in chat
    if (onMessageSent) onMessageSent(content);
    setTyping('');
    try {
      sendGTMEvent({ event: 'user_ai_chat' });
      await sendMessage({ content, id });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className={styles.form}>
      <Input
        name="message"
        value={typing}
        onKeyPress={onKeyPress}
        onChange={(v) => setTyping(v)}
        placeholder="Type in your message..."
      />
      <button
        type="button"
        aria-label="Send"
        disabled={sending}
        style={typing ? { background: '#6361F3' } : {}}
        onClick={onSend}
      />
    </div>
  );
}
