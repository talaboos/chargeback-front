'use client';

import Image from 'next/image';
import styles from './guide.module.scss';

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function StepIndicator({ number, isLast }) {
  return (
    <div className={styles.stepLeft}>
      <div className={number === '✓' ? styles.stepCheck : styles.stepNumber}>
        {number === '✓' ? <CheckIcon /> : number}
      </div>
      {!isLast && <div className={styles.dashedLine} />}
    </div>
  );
}

export default function IOSGuide() {
  return (
    <div className={styles.guide}>
      <div className={styles.step}>
        <StepIndicator number={1} />
        <div className={styles.stepContent}>
          <div className={styles.stepTitle}>Tap the &ldquo;Share&rdquo; icon</div>
          <div className={styles.card}>
            <div className={styles.safariBar}>
              <span className={styles.safariIcon}><ChevronLeft /></span>
              <span className={styles.safariIcon}><ChevronRight /></span>
              <span className={styles.safariIconActive}><ShareIcon /></span>
              <span className={styles.safariIcon}><BookIcon /></span>
              <span className={styles.safariIcon}><CopyIcon /></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.step}>
        <StepIndicator number={2} />
        <div className={styles.stepContent}>
          <div className={styles.stepTitle}>Select &ldquo;Add to Home Screen&rdquo;</div>
          <div className={styles.card}>
            <div className={styles.menuRowHighlight}>
              <span>Add to Home Screen</span>
              <span className={styles.menuIcon}><PlusSquareIcon /></span>
            </div>
            <div className={styles.menuRowDim}>
              <span>Add to New Quick Note</span>
              <span className={styles.menuIcon}><NoteIcon /></span>
            </div>
            <div className={styles.menuRowDim}>
              <span>Open in Chrome</span>
              <span className={styles.menuIcon}><ChromeIcon /></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.step}>
        <StepIndicator number="✓" isLast />
        <div className={styles.stepContent}>
          <div className={styles.stepTitle}>Tap &ldquo;Add&rdquo; — and we&apos;ll stay connected!</div>
          <div className={styles.card}>
            <div className={styles.confirmBar}>
              <span className={styles.confirmCancel}>Cancel</span>
              <span className={styles.confirmTitle}>Add to Home Screen</span>
              <span className={styles.confirmAdd}>Add</span>
            </div>
            <div className={styles.appInfo}>
              <div className={styles.appLogo}>
                <Image src="/favicon-96x96.png" width={48} height={48} alt="Reclaim" />
              </div>
              <div>
                <div className={styles.appName}>Reclaim AI</div>
                <div className={styles.appDomain}>app.reclaim.tools</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
