'use client';

import { useState, createContext, useContext, useMemo } from 'react';
import Pusher from 'pusher-js';

export const PusherContext = createContext(null);

export default function PusherProvider({ children }) {
  const [pusher, setPusher] = useState(null);

  const connectPusher = () => {
    if (pusher) return;
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

    if (!key) {
      console.error('[Pusher] NEXT_PUBLIC_PUSHER_APP_KEY is not set');
      return;
    }

    const newPusher = new Pusher(key, {
      cluster,
      encrypted: true,
      channelAuthorization: {
        endpoint: '/api/pusher/auth',
      },
    });

    newPusher.connection.bind('error', (err) => {
      console.error('[Pusher] connection error:', err);
    });

    setPusher(newPusher);
  };

  const valuePusherProvider = useMemo(
    () => ({
      pusher,
      connectPusher,
    }),
    [pusher],
  );

  return (
    <PusherContext.Provider value={valuePusherProvider}>
      {children}
    </PusherContext.Provider>
  );
}

export const usePusher = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error('Something went wrong!');
  }

  return context;
};
