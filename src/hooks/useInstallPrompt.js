'use client';

import { useState, useEffect, useCallback } from 'react';

let deferredPrompt = null;

export default function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If prompt was already captured before hook mounted
    if (deferredPrompt) {
      setCanInstall(true);
      setReady(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
      setReady(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Give browser time to fire beforeinstallprompt before showing fallback
    const timer = setTimeout(() => setReady(true), 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    setCanInstall(false);

    return outcome === 'accepted';
  }, []);

  return { canInstall, install, ready };
}
