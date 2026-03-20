'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai/index';
import Image from 'next/image';

import Button from '@/components/Controls/Buttons/button';
import IOSGuide from '@/components/InstallGuide/IOSGuide';
import useInstallPrompt from '@/hooks/useInstallPrompt';

import { shortcutAtom } from '@/state/atoms/shortcutAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function ShortcutModal() {
  const [, setModal] = useAtom(modalAtom);
  const [, setPopup] = useAtom(shortcutAtom);
  const { canInstall, install } = useInstallPrompt();
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  const onClose = (e) => {
    e.preventDefault();
    setPopup(false);
    setModal({ open: false });
  };

  const handleInstall = async (e) => {
    e.preventDefault();
    const accepted = await install();
    if (accepted) {
      setInstalled(true);
      setTimeout(() => {
        setPopup(false);
        setModal({ open: false });
      }, 1500);
    }
  };

  return (
    <div className={styles.shortcut}>
      <div className={styles.heading}>
        {installed ? 'App Installed!' : 'Add to Home Screen'}
      </div>
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Android / Chrome — native install */}
          {canInstall && !isIOS && !installed && (
            <div className={styles.installPrompt}>
              <div className={styles.installAppInfo}>
                <Image
                  src="/favicon-96x96.png"
                  width={52}
                  height={52}
                  alt="Reclaim"
                  style={{ borderRadius: 12 }}
                />
                <div className={styles.installAppText}>
                  <strong>Reclaim AI</strong>
                  <span>app.reclaim.tools</span>
                </div>
              </div>
              <button className={styles.installButton} onClick={handleInstall}>
                Install App
              </button>
            </div>
          )}

          {/* Installed */}
          {installed && (
            <div className={styles.installedMessage}>
              Check your home screen!
            </div>
          )}

          {/* iOS — full step-by-step guide */}
          {isIOS && !installed && <IOSGuide />}

          {/* Fallback */}
          {!canInstall && !isIOS && !installed && (
            <div className={styles.chat}>
              <Image
                src="/favicon-96x96.png"
                width={52}
                priority
                height={52}
                alt="Reclaim"
                style={{ borderRadius: 12 }}
              />
              <div>
                Open in <strong>Chrome</strong> or <strong>Safari</strong> to install the app.
              </div>
            </div>
          )}
        </div>
        {!installed && (
          <Button url="/" onClick={onClose}>
            Got it!
          </Button>
        )}
      </main>
    </div>
  );
}
