'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useAtom } from 'jotai/index';

import TapBar from '@/components/TapBar';
import ShortcutModal from '@/components/Modal/shortcut';

import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './page.module.scss';

export default function Home() {
  const [, setModal] = useAtom(modalAtom);
  const [gmailStatus, setGmailStatus] = useState(null);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  const onShortcut = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModal({
      type: 'window',
      open: true,
      content: <ShortcutModal />,
    });
  };

  const fetchGmailStatus = async () => {
    try {
      const res = await fetch('/api/gmail/status');
      if (res.ok) {
        const data = await res.json();
        setGmailStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch Gmail status:', err);
    } finally {
      setGmailLoading(false);
    }
  };

  useEffect(() => {
    fetchGmailStatus();
  }, []);

  const handleConnectGmail = async () => {
    try {
      const res = await fetch('/api/gmail/connect');
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error('Failed to connect Gmail:', err);
    }
  };

  const handleDisconnectGmail = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch('/api/gmail/disconnect', { method: 'POST' });
      if (res.ok) {
        setGmailStatus({ connected: false, email: null });
      }
    } catch (err) {
      console.error('Failed to disconnect Gmail:', err);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>Settings</div>
      </header>
      <main className={styles.main}>
        <div className={styles.sectionLabel}>Linked Accounts</div>
        <div className={styles.group}>
          {gmailLoading ? (
            <div className={styles.row}>
              <div className={styles.rowContent}>
                <span className={styles.rowTitle}>Gmail</span>
                <span className={styles.rowSubtitle}>Loading...</span>
              </div>
            </div>
          ) : gmailStatus?.connected ? (
            <div className={styles.row}>
              <div className={styles.rowIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 8.608V16.75C22 18.483 20.613 19.9 18.89 19.95H18.85H5.15C3.41 19.95 2 18.535 2 16.79V16.79V8.618C2.32 8.988 2.69 9.308 3.1 9.568L9.56 13.818C10.28 14.308 11.14 14.568 12.01 14.568C12.88 14.568 13.74 14.308 14.45 13.828L20.9 9.568C21.31 9.298 21.68 8.978 22 8.608Z"
                    fill="var(--system-blue, #007AFF)"
                  />
                  <path
                    d="M21.17 5.84959C20.34 4.46959 18.79 3.56959 17.04 3.56959H6.96C5.21 3.56959 3.66 4.46959 2.83 5.84959C3 5.74959 3.18 5.66959 3.37 5.60959L9.83 1.35959C10.55 0.869594 11.41 0.609594 12.28 0.609594C13.15 0.609594 14.01 0.869594 14.72 1.34959L21.17 5.59959L21.28 5.67959C21.25 5.66959 21.21 5.64959 21.17 5.84959Z"
                    fill="var(--system-blue, #007AFF)"
                  />
                </svg>
              </div>
              <div className={styles.rowContent}>
                <span className={styles.rowTitle}>Gmail</span>
                <span className={styles.rowSubtitle}>{gmailStatus.email}</span>
              </div>
              <button
                className={styles.disconnectBtn}
                onClick={handleDisconnectGmail}
                disabled={disconnecting}
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <button className={styles.rowButton} onClick={handleConnectGmail}>
              <div className={styles.rowIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 8.608V16.75C22 18.483 20.613 19.9 18.89 19.95H18.85H5.15C3.41 19.95 2 18.535 2 16.79V16.79V8.618C2.32 8.988 2.69 9.308 3.1 9.568L9.56 13.818C10.28 14.308 11.14 14.568 12.01 14.568C12.88 14.568 13.74 14.308 14.45 13.828L20.9 9.568C21.31 9.298 21.68 8.978 22 8.608Z"
                    fill="var(--label-secondary, #3C3C43)"
                  />
                  <path
                    d="M21.17 5.84959C20.34 4.46959 18.79 3.56959 17.04 3.56959H6.96C5.21 3.56959 3.66 4.46959 2.83 5.84959C3 5.74959 3.18 5.66959 3.37 5.60959L9.83 1.35959C10.55 0.869594 11.41 0.609594 12.28 0.609594C13.15 0.609594 14.01 0.869594 14.72 1.34959L21.17 5.59959L21.28 5.67959C21.25 5.66959 21.21 5.64959 21.17 5.84959Z"
                    fill="var(--label-secondary, #3C3C43)"
                  />
                </svg>
              </div>
              <div className={styles.rowContent}>
                <span className={styles.rowTitle}>Connect Gmail</span>
                <span className={styles.rowSubtitle}>Scan for subscriptions</span>
              </div>
              <div className={styles.chevron}>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </button>
          )}
        </div>

        <div className={styles.sectionLabel}>General</div>
        <div className={styles.group}>
          <Link href="/shortcut" onClick={onShortcut} className={styles.rowLink}>
            <div className={styles.rowContent}>
              <span className={styles.rowTitle}>Add Reclaim Tool shortcut</span>
            </div>
            <div className={styles.chevron}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </Link>
        </div>

        <div className={styles.sectionLabel}>Legal</div>
        <div className={styles.group}>
          <a
            href="https://reclaim.tools/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rowLink}
          >
            <div className={styles.rowContent}>
              <span className={styles.rowTitle}>Privacy Policy</span>
            </div>
            <div className={styles.chevron}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </a>
          <div className={styles.divider} />
          <a
            href="https://reclaim.tools/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rowLink}
          >
            <div className={styles.rowContent}>
              <span className={styles.rowTitle}>Terms of Use</span>
            </div>
            <div className={styles.chevron}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </a>
          <div className={styles.divider} />
          <a
            href="https://reclaim.tools/subscription-policy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rowLink}
          >
            <div className={styles.rowContent}>
              <span className={styles.rowTitle}>Subscription Policy</span>
            </div>
            <div className={styles.chevron}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </a>
          <div className={styles.divider} />
          <a
            href="https://reclaim.tools/cookie-policy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rowLink}
          >
            <div className={styles.rowContent}>
              <span className={styles.rowTitle}>Cookie Policy</span>
            </div>
            <div className={styles.chevron}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.29289 5.29289C5.68342 5.68342 5.68342 6.31658 5.29289 6.70711L1 11" stroke="var(--label-tertiary, #C7C7CC)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </a>
        </div>

        <button
          className={styles.logoutBtn}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Log Out
        </button>
      </main>
      <div className={styles.tapbarWrap}>
        <TapBar current="settings" />
      </div>
    </div>
  );
}
