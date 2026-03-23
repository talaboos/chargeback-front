'use client';

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import styles from './banner.module.scss';

const POLL_INTERVAL = 2000;
const MAX_POLL_TIME = 5 * 60 * 1000; // 5 min

const GmailSyncBanner = forwardRef(function GmailSyncBanner({ onComplete }, ref) {
  const [scanStatus, setScanStatus] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [visible, setVisible] = useState(false);
  const pollRef = useRef(null);
  const startTimeRef = useRef(null);
  const dismissTimerRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const acknowledge = useCallback(async () => {
    try {
      await fetch('/api/gmail/scan/ack', { method: 'POST' });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    stopPolling();
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (scanStatus === 'completed' || scanStatus === 'failed') {
      acknowledge();
    }
  }, [scanStatus, stopPolling, acknowledge]);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/gmail/status');
      if (!res.ok) return;
      const data = await res.json();

      if (!data.connected) {
        stopPolling();
        setVisible(false);
        return;
      }

      const status = data.scan_status;
      const result = data.scan_result;

      setScanStatus(status);
      setScanResult(result);

      if (status === 'processing') {
        setVisible(true);
        if (startTimeRef.current && Date.now() - startTimeRef.current > MAX_POLL_TIME) {
          stopPolling();
        }
      } else if (status === 'completed') {
        setVisible(true);
        stopPolling();
        onComplete?.();
        dismissTimerRef.current = setTimeout(handleDismiss, 5000);
      } else if (status === 'failed') {
        setVisible(true);
        stopPolling();
        dismissTimerRef.current = setTimeout(handleDismiss, 8000);
      } else {
        stopPolling();
      }
    } catch (e) {
      // network error, keep polling
    }
  }, [stopPolling, onComplete, handleDismiss]);

  const startPolling = useCallback(() => {
    stopPolling();
    startTimeRef.current = Date.now();
    pollRef.current = setInterval(checkStatus, POLL_INTERVAL);
  }, [stopPolling, checkStatus]);

  // Trigger scan — called by parent via ref
  const triggerScan = useCallback(async () => {
    try {
      setScanStatus('processing');
      setScanResult(null);
      setVisible(true);

      const res = await fetch('/api/gmail/scan', { method: 'POST' });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json.error === 'insufficient_permissions') {
          setScanStatus('failed');
          setScanResult({ error: 'insufficient_permissions' });
          return;
        }
        throw new Error(json.error || 'Scan failed');
      }

      // Job dispatched, start polling
      startPolling();
    } catch (err) {
      console.error('Gmail scan trigger error:', err);
      setScanStatus('failed');
      setScanResult({ error: 'scan_failed' });
    }
  }, [startPolling]);

  useImperativeHandle(ref, () => ({
    triggerScan,
  }), [triggerScan]);

  // Check status on mount (page reload detection)
  useEffect(() => {
    const initialCheck = async () => {
      try {
        const res = await fetch('/api/gmail/status');
        if (!res.ok) return;
        const data = await res.json();

        if (!data.connected) return;

        setScanStatus(data.scan_status);
        setScanResult(data.scan_result);

        if (data.scan_status === 'processing') {
          setVisible(true);
          startPolling();
        } else if (data.scan_status === 'completed') {
          setVisible(true);
          onComplete?.();
          dismissTimerRef.current = setTimeout(() => {
            setVisible(false);
            acknowledge();
          }, 5000);
        } else if (data.scan_status === 'failed') {
          setVisible(true);
          dismissTimerRef.current = setTimeout(() => {
            setVisible(false);
            acknowledge();
          }, 8000);
        }
      } catch (e) {
        // ignore
      }
    };

    initialCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopPolling();
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [stopPolling]);

  if (!visible) return null;

  const isError = scanStatus === 'failed';
  const isDone = scanStatus === 'completed';
  const isProcessing = scanStatus === 'processing';

  const getMessage = () => {
    if (isProcessing) return 'Syncing Gmail subscriptions...';
    if (isDone) {
      const found = scanResult?.found || 0;
      const newCount = scanResult?.new || 0;
      if (newCount > 0) {
        return `Found ${found} subscription${found !== 1 ? 's' : ''}, ${newCount} new added!`;
      }
      return `Scan complete — ${found} subscription${found !== 1 ? 's' : ''} found`;
    }
    if (isError) {
      if (scanResult?.error === 'insufficient_permissions') {
        return 'Gmail permissions missing. Reconnect in Settings.';
      }
      return 'Gmail sync failed. Try again later.';
    }
    return '';
  };

  return (
    <div className={`${styles.banner} ${isDone ? styles.success : ''} ${isError ? styles.error : ''}`}>
      <div className={styles.content}>
        {isProcessing && <div className={styles.spinner} />}
        {isDone && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#fff" />
            <path d="M8 12.5L10.5 15L16 9.5" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isError && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
            <path d="M15 9L9 15M9 9L15 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
        <span className={styles.message}>{getMessage()}</span>
      </div>
      {!isProcessing && (
        <button className={styles.dismiss} onClick={handleDismiss}>✕</button>
      )}
    </div>
  );
});

export default GmailSyncBanner;
