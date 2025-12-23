'use client';

import { useEffect, useState, useRef, Fragment } from 'react';

import Typing from '@/components/Typing';

import { usePusher } from '@/state/contexts/pusherProvider';

import styles from './communication.module.scss';

export default function Communication({ data, user }) {
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState(data);
  const [typing, setTyping] = useState(false);
  const { pusher, connectPusher } = usePusher();

  const scrollTobottom = async () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollTobottom();
  }, [messages, typing]);

  useEffect(() => {
    connectPusher();
  }, []);

  useEffect(() => {
    if (!pusher) return undefined;
    const channelName = `private-messages.user-${user}`;
    const channel = pusher.subscribe(channelName);
    channel.bind_global((event, res) => {
      if (event === 'message.sent' || event === 'message.received') {
        const { data: response } = res;

        setMessages((prev) => [...prev, response]);
      }
      if (event === 'typing.started') {
        setTyping(true);
      }
      if (event === 'typing.stopped') {
        setTyping(false);
      }
    });

    return () => {
      if (pusher) {
        pusher.disconnect();
        pusher.unsubscribe(channelName);
      }
    };
  }, [pusher]);

  return (
    <div className={styles.scroll}>
      {messages.map((message) => (
        <Fragment key={message.id}>
          {(() => {
            if (
              message.message_type !== 'error' &&
              message.message_type === 'chat_response' &&
              message.sender_type === 'ai'
            )
              return (
                <div
                  className={`${styles.message} ${message.sender_type === 'user' && styles.user}`}
                >
                  {JSON.parse(message.content).text}
                </div>
              );

            return null;
          })()}
          {(() => {
            if (
              message.message_type !== 'error' &&
              message.message_type === 'text'
            )
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
