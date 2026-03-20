'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useInstallPrompt from '@/hooks/useInstallPrompt';
import IOSGuide from '@/components/InstallGuide/IOSGuide';
import Button from '@/components/Controls/Buttons/button';
import styles from './page.module.scss';

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function ShortcutPage() {
  const { canInstall, install } = useInstallPrompt();
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const ua = navigator.userAgent;
    const isApple = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isApple);
  }, []);

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) {
      setInstalled(true);
    }
  };

  // Already installed as PWA
  if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.heading}>App is already installed!</div>
        </header>
        <Button url="/home">Got it!</Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>Add to Home Screen</div>
      </header>
      <main>
        {/* Android / Chrome / Edge — native install prompt */}
        {canInstall && !isIOS && !installed && (
          <div className={styles.guide}>
            <div className={styles.installPrompt}>
              <div className={styles.appInfo}>
                <div className={styles.appLogo}>
                  <Image src="/favicon-96x96.png" width={48} height={48} alt="Reclaim" />
                </div>
                <div>
                  <div className={styles.appName}>Reclaim Tool</div>
                  <div className={styles.appDomain}>app.reclaim.tools</div>
                </div>
              </div>
              <button className={styles.installButton} onClick={handleInstall}>
                <DownloadIcon />
                <span>Install App</span>
              </button>
            </div>
          </div>
        )}

        {/* Installed successfully */}
        {installed && (
          <div className={styles.guide}>
            <div className={styles.successMessage}>
              <div className={styles.stepCheck}><CheckIcon /></div>
              <div className={styles.successText}>App installed! Check your home screen.</div>
            </div>
          </div>
        )}

        {/* iOS — show manual instructions */}
        {isIOS && <IOSGuide />}

        {/* Fallback: no prompt available, not iOS */}
        {!canInstall && !isIOS && !installed && (
          <div className={styles.guide}>
            <div className={styles.fallbackMessage}>
              <p>Open this page in <strong>Chrome</strong> or <strong>Safari</strong> to install the app on your device.</p>
            </div>
          </div>
        )}
      </main>

      <div className={styles.bottomButton}>
        <Button url="/home">Got it!</Button>
      </div>
    </div>
  );
}
