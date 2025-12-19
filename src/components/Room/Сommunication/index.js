'use client';

import { useEffect, useState, useRef, Fragment } from 'react';

import Typing from '@/components/Typing';

import { usePusher } from '@/state/contexts/pusherProvider';

import styles from './communication.module.scss';

export default function Communication({ data }) {
  const messageEndRef = useRef(null);
  const [messages] = useState(data);
  const [typing] = useState(false);
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
    console.log('pusher', pusher);
    // const channelName = `private-messages-${user}.chat-${id}`;
    // const channel = pusher.subscribe(channelName);
    // channel.bind_global((event, res) => {
    //   if (event === 'message.sent' || event === 'message.received') {
    //     const { data: response } = res;
    //
    //     if (response.message_type === 'generated_photo' || response.message_type === 'error') {
    //       setPending(id, '');
    //     }
    //
    //     setMessages((prev) => [...prev, response]);
    //   }
    //   if (event === 'typing.started') {
    //     setTyping(true);
    //   }
    //   if (event === 'typing.stopped') {
    //     setTyping(false);
    //   }
    // });

    return () => {
      if (pusher) {
        pusher.disconnect();
        //pusher.unsubscribe(channelName);
      }
    };
  }, [pusher]);

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
