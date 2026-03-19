'use client';

import { useEffect, useRef } from 'react';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { app } from '@/services/firebase';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

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

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const messaging = getMessaging(app);
        const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

        if (!fcmToken) return;

        // Check if already registered this token
        const storedToken = localStorage.getItem('fcm_token');
        if (storedToken === fcmToken) return;

        // Register with backend
        const res = await fetch('/api/device-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcm_token: fcmToken, device_type: 'web' }),
        });

        if (res.ok) {
          localStorage.setItem('fcm_token', fcmToken);
        }
      } catch (err) {
        console.error('Push notification registration failed:', err);
      }
    };

    registered.current = true;
    register();
  }, []);
}
