'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai/index';
import Image from 'next/image';

import IOSGuide from '@/components/InstallGuide/IOSGuide';
import useInstallPrompt from '@/hooks/useInstallPrompt';

import { shortcutAtom } from '@/state/atoms/shortcutAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function ShortcutModal() {
  const [, setModal] = useAtom(modalAtom);
  const [, setPopup] = useAtom(shortcutAtom);
  const { canInstall, install, ready } = useInstallPrompt();
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isApple = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isApple);
  }, []);

  const closeModal = () => setModal({ open: false });

  const onDone = (e) => {
    e.preventDefault();
    setPopup('done');
    closeModal();
  };

  const onRemindLater = (e) => {
    e.preventDefault();
    setPopup('later');
    closeModal();
  };

  const handleInstall = async (e) => {
    e.preventDefault();
    const accepted = await install();
    if (accepted) {
      setInstalled(true);
      setPopup('done');
      setTimeout(closeModal, 1500);
    }
  };

  return (
    <div className={styles.shortcut}>
      <div className={styles.heading}>
        {installed ? 'App Installed!' : 'Add to Home Screen'}
      </div>
      <main className={styles.main}>
        <div className={styles.content}>
          {/* iOS — full step-by-step guide (show immediately) */}
          {isIOS && !installed && <IOSGuide />}

          {/* Non-iOS: wait for install prompt check */}
          {!isIOS && !installed && ready && canInstall && (
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
                  <strong>Reclaim Tool</strong>
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
        </div>
        {!installed && (
          <div className={styles.shortcutActions}>
            <button className={styles.doneButton} onClick={onDone}>
              Done
            </button>
            <button className={styles.remindButton} onClick={onRemindLater}>
              Remind me later
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
