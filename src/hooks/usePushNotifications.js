'use client';

import { useEffect, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const messagingFirebaseConfig = {
  apiKey: 'AIzaSyDAXVQL_NX21EVPv22fuJuSROa_8v3UbQM',
  authDomain: 'reclaim-38744.firebaseapp.com',
  projectId: 'reclaim-38744',
  storageBucket: 'reclaim-38744.firebasestorage.app',
  messagingSenderId: '25440715803',
  appId: '1:25440715803:web:fdfdb0e5d41b579be8e4be',
};

function getMessagingApp() {
  const existing = getApps().find((a) => a.name === 'messaging');
  return existing || initializeApp(messagingFirebaseConfig, 'messaging');
}

export default function usePushNotifications() {
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    if (!VAPID_KEY) return;
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const supported = await isSupported();
        if (!supported) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const messagingApp = getMessagingApp();
        const messaging = getMessaging(messagingApp);
        const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (!fcmToken) return;

        const storedToken = localStorage.getItem('fcm_token');
        if (storedToken === fcmToken) return;

        const res = await fetch('/api/device-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcm_token: fcmToken, device_type: 'web' }),
        });

        if (res.ok) {
          localStorage.setItem('fcm_token', fcmToken);
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          const { title, body } = payload.notification || {};
          if (title && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon-96x96.png' });
          }
        });
      } catch (err) {
        console.error('Push notification registration failed:', err);
      }
    };

    registered.current = true;
    register();
  }, []);
}
