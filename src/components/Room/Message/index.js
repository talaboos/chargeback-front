'use client';

import { useState } from 'react';

import Input from '@/components/Controls/Input';

import styles from './message.module.scss';

export default function Message() {
  const [typing, setTyping] = useState('');
  const [sending, setSending] = useState(false);

  const onSend = async () => {
    setSending(true);
    //const { status } = await sendMessage({ content: typing, id });
    const status = 'success';
    if (status === 'success') {
      setTyping('');
    }
    setSending(false);
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
