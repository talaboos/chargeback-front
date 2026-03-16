'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai/index';
import { sendGTMEvent } from '@next/third-parties/google';

import TapBar from '@/components/TapBar';
import AddSourceMenu from '@/components/AddSourceMenu';
import ShortcutModal from '@/components/Modal/shortcut';
import SubscriptionCard from '@/components/SubscriptionCard';
import SubscriptionDetail from '@/components/SubscriptionDetail';

import useFetch from '@/hooks/useFetch';
import { idAtom } from '@/state/atoms/idAtom';
import { shortcutAtom } from '@/state/atoms/shortcutAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './page.module.scss';

function formatTotal(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num);
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [id, setId] = useAtom(idAtom);
  const [popup] = useAtom(shortcutAtom);
  const [, setModal] = useAtom(modalAtom);

  useEffect(() => {
    if (popup) {
      setModal({
        type: 'window',
        open: true,
        content: <ShortcutModal />,
      });
    }
  }, [popup, setModal]);

  const { data: subsData, error, mutate } = useFetch('/api/subscriptions', {
    refreshInterval: 0,
  });

  const loading = !subsData && !error;
  const subscriptions = subsData?.data || [];
  const totalMonthly = subsData?.total_monthly || 0;
  const currency = subsData?.currency || 'USD';
  const totalsByCurrency = subsData?.totals_by_currency || {};

  const handleCancel = useCallback(
    async (subId) => {
      try {
        const res = await fetch(`/api/subscriptions/${subId}/cancel`, {
          method: 'POST',
        });
        if (res.ok) {
          sendGTMEvent({ event: 'subscription_cancelled' });
          mutate();
        }
      } catch {}
    },
    [mutate],
  );

  const [processing, setProcessing] = useState(false);
  const pollRef = useRef(null);

  const pollForResult = useCallback(
    (messageId) => {
      setProcessing(true);
      let attempts = 0;
      const maxAttempts = 30; // 30 * 2s = 60s max

      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          const res = await fetch(`/api/gpt?id=${messageId}`);
          if (res.ok) {
            const json = await res.json();
            if (json.status === 'completed' || json.status === 'success') {
              clearInterval(pollRef.current);
              setProcessing(false);
              mutate(); // refresh subscriptions list
            }
          }
        } catch {}

        if (attempts >= maxAttempts) {
          clearInterval(pollRef.current);
          setProcessing(false);
          mutate(); // try refresh anyway
        }
      }, 2000);
    },
    [mutate],
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleUploadComplete = (result) => {
    if (result?.data?.id) {
      sendGTMEvent({ event: 'user_file_attached' });
      setId(result.data.id);
      pollForResult(result.data.id);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>Subscriptions</div>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loaderWrap}>
            <div className={styles.loading}>Loading...</div>
          </div>
        ) : processing ? (
          <div className={styles.loaderWrap}>
            <div className={styles.loading}>Analyzing your screenshot...</div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className={styles.content}>
            <div className={styles.info}>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z"
                      fill="#D2D2D4"
                    />
                  </svg>
                </div>
                <div className={styles.emptyTitle}>No subscriptions yet</div>
                <div className={styles.emptyDescription}>
                  Upload a screenshot or connect Gmail to start tracking your
                  subscriptions
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.totalCard}>
              <div className={styles.totalLabel}>Monthly Spending</div>
              <div className={styles.totalAmount}>
                {formatTotal(totalMonthly, currency)}
              </div>
              {Object.keys(totalsByCurrency).length > 1 && (
                <div className={styles.totalOther}>
                  {Object.entries(totalsByCurrency)
                    .filter(([cur]) => cur !== currency)
                    .map(([cur, amount]) => (
                      <span key={cur}>+ {formatTotal(amount, cur)}</span>
                    ))}
                </div>
              )}
              <div className={styles.totalSub}>
                {subscriptions.filter((s) => s.status === 'active').length}{' '}
                active subscription
                {subscriptions.filter((s) => s.status === 'active').length !== 1
                  ? 's'
                  : ''}
              </div>
            </div>
            <div className={styles.list}>
              {subscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={() => setSelectedSub(sub)}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <button
        className={styles.fab}
        onClick={() => setMenuOpen(true)}
        aria-label="Add subscription"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {menuOpen && (
        <AddSourceMenu
          onClose={() => setMenuOpen(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
      <div className={styles.tapbarWrap}>
        <TapBar current="home" />
      </div>
      {selectedSub && (
        <SubscriptionDetail
          subscription={selectedSub}
          onCancel={handleCancel}
          onClose={() => {
            setSelectedSub(null);
            mutate();
          }}
        />
      )}
    </div>
  );
}
