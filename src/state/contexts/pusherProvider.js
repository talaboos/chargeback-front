'use client';

import { useState, createContext, useContext, useMemo } from 'react';
import Pusher from 'pusher-js';

export const PusherContext = createContext(null);

export default function PusherProvider({ children }) {
  const [pusher, setPusher] = useState(null);

  const connectPusher = () => {
    const newPusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      encrypted: true,
      channelAuthorization: {
        endpoint: '/api/pusher',
      },
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
