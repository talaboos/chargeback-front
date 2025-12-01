'use client';

import { useEffect, useState, useRef, Fragment } from 'react';

import Typing from '@/components/Typing';

import styles from './communication.module.scss';

export default function Communication({ data }) {
  const messageEndRef = useRef(null);
  const [messages] = useState(data);
  const [typing] = useState(false);

  const scrollTobottom = async () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollTobottom();
  }, [messages, typing]);

  return (
    <div className={styles.scroll}>
      {messages.map((message) => (
        <Fragment key={message.id}>
          {(() => {
            if (message.message_type !== 'error')
              return (
                <div
                  className={`${styles.message} ${message.sender_type === 'user' && styles.user}`}
                >
                  {message.content}
                </div>
              );

            return null;
          })()}
        </Fragment>
      ))}
      {typing && <Typing />}
      <div className={styles.end} ref={messageEndRef} />
    </div>
  );
}
