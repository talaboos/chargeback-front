'use client';

import { useState, useEffect, useCallback } from 'react';

let deferredPrompt = null;

export default function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // If prompt was already captured before hook mounted
    if (deferredPrompt) {
      setCanInstall(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
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

  return { canInstall, install };
}
