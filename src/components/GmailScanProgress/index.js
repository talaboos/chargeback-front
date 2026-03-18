'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './progress.module.scss';

const STAGES = [
  { message: 'Connecting to Gmail...', duration: 3000 },
  { message: 'Searching for subscription emails...', duration: 5000 },
  { message: 'Analyzing emails with AI...', duration: 12000 },
  { message: 'Almost done...', duration: Infinity },
];

export default function GmailScanProgress({ onClose, onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const stageTimerRef = useRef(null);
  const fetchedRef = useRef(false);

  // Cycle through stages on timers
  useEffect(() => {
    const stage = STAGES[stageIndex];
    if (!stage || stage.duration === Infinity || scanResult || error) return;

    stageTimerRef.current = setTimeout(() => {
      if (stageIndex < STAGES.length - 1) {
        setStageIndex((i) => i + 1);
      }
    }, stage.duration);

    return () => clearTimeout(stageTimerRef.current);
  }, [stageIndex, scanResult, error]);

  // Fire the scan request once on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const doScan = async () => {
      try {
        const res = await fetch('/api/gmail/scan', { method: 'POST' });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || 'Scan failed');
        }
        const data = await res.json();
        setScanResult(data);
      } catch (err) {
        console.error('Gmail scan error:', err);
        setError(err.message || 'Something went wrong');
      }
    };

    doScan();
  }, []);

  const handleDone = () => {
    onComplete?.();
  };

  const stage = STAGES[stageIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {error ? (
          <>
            <div className={styles.iconWrap}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--system-red, #FF3B30)" strokeWidth="1.5" />
                <path d="M15 9L9 15M9 9L15 15" stroke="var(--system-red, #FF3B30)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.message}>Something went wrong</div>
            <div className={styles.detail}>{error}</div>
            <button className={styles.doneBtn} onClick={onClose}>
              Close
            </button>
          </>
        ) : scanResult ? (
          <>
            <div className={styles.iconWrap}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="var(--system-green, #34C759)" />
                <path d="M8 12.5L10.5 15L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.message}>
              Found {scanResult.found || 0} subscription{(scanResult.found || 0) !== 1 ? 's' : ''}!
            </div>
            {scanResult.new > 0 && (
              <div className={styles.detail}>
                {scanResult.new} new subscription{scanResult.new !== 1 ? 's' : ''} added
              </div>
            )}
            <button className={styles.doneBtn} onClick={handleDone}>
              Done
            </button>
          </>
        ) : (
          <>
            <div className={styles.spinnerWrap}>
              <div className={styles.spinner} />
            </div>
            <div className={styles.message}>{stage.message}</div>
            <div className={styles.stageIndicator}>
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i <= stageIndex ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
