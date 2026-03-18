'use client';

import { useState } from 'react';
import styles from './promo.module.scss';

export default function GmailPromo({ onConnect, onSkip }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    onConnect();
  };

  return (
    <div className={styles.overlay}>
      {connecting && <div className={styles.loadingBar} />}
      <div className={styles.container}>
        <div className={styles.iconWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 8.608V16.75C22 18.483 20.613 19.9 18.89 19.95H18.85H5.15C3.41 19.95 2 18.535 2 16.79V16.79V8.618C2.32 8.988 2.69 9.308 3.1 9.568L9.56 13.818C10.28 14.308 11.14 14.568 12.01 14.568C12.88 14.568 13.74 14.308 14.45 13.828L20.9 9.568C21.31 9.298 21.68 8.978 22 8.608Z"
              fill="#007AFF"
            />
            <path
              d="M21.17 5.84959C20.34 4.46959 18.79 3.56959 17.04 3.56959H6.96C5.21 3.56959 3.66 4.46959 2.83 5.84959C3 5.74959 3.18 5.66959 3.37 5.60959L9.83 1.35959C10.55 0.869594 11.41 0.609594 12.28 0.609594C13.15 0.609594 14.01 0.869594 14.72 1.34959L21.17 5.59959L21.28 5.67959C21.25 5.66959 21.21 5.64959 21.17 5.84959Z"
              fill="#007AFF"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Find your subscriptions</h1>
        <p className={styles.subtitle}>
          Connect Gmail to automatically discover recurring charges and subscriptions from your inbox.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.featureText}>Scans for subscription emails</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.featureText}>Detects active and expired plans</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.featureText}>Your data stays private and secure</span>
          </div>
        </div>

        <button className={styles.connectBtn} onClick={handleConnect} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Gmail'}
        </button>
        <button className={styles.skipBtn} onClick={onSkip} disabled={connecting}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
