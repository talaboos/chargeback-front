'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai/index';
import { sendGTMEvent } from '@next/third-parties/google';

import TapBar from '@/components/TapBar';
import AddSourceMenu from '@/components/AddSourceMenu';
import ShortcutModal from '@/components/Modal/shortcut';
import SubscriptionCard from '@/components/SubscriptionCard';
import SubscriptionDetail from '@/components/SubscriptionDetail';
import AddSubscription from '@/components/AddSubscription';
import GmailScanProgress from '@/components/GmailScanProgress';
import GmailPromo from '@/components/GmailPromo';

import useFetch from '@/hooks/useFetch';
import usePushNotifications from '@/hooks/usePushNotifications';
import { idAtom } from '@/state/atoms/idAtom';
import { modalAtom } from '@/state/atoms/modalAtom';

import styles from './page.module.scss';

function formatTotal(amount, currency) {
  const num = parseFloat(amount);
  const val = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  }).format(val);
}

export default function Home() {
  usePushNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [gmailScanning, setGmailScanning] = useState(false);
  const [id, setId] = useAtom(idAtom);
  const [, setModal] = useAtom(modalAtom);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('shortcut');
      // Don't show if explicitly dismissed with "Done"
      if (stored === '"done"') return;
      setModal({
        type: 'window',
        open: true,
        content: <ShortcutModal />,
      });
    } catch (e) {
      // localStorage unavailable
    }
  }, [setModal]);

  // Detect ?gmail_connected=true after OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('gmail_connected') === 'true') {
      // Remove the query param from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('gmail_connected');
      window.history.replaceState({}, '', url.pathname + url.search);
      // Auto-trigger scan
      setGmailScanning(true);
    }
  }, []);

  const { data: subsData, error, mutate: rawMutate } = useFetch('/api/subscriptions', {
    refreshInterval: 0,
  });

  const [refreshing, setRefreshing] = useState(false);
  const mutate = useCallback(async (...args) => {
    setRefreshing(true);
    try {
      await rawMutate(...args);
    } finally {
      setRefreshing(false);
    }
  }, [rawMutate]);

  useEffect(() => {
    if (error?.status === 401) {
      window.location.href = '/login/verification';
    }
  }, [error]);

  const loading = !subsData && !error;
  const rawSubscriptions = subsData?.data || [];
  const totalMonthly = subsData?.total_monthly || 0;
  const currency = subsData?.currency || 'USD';
  const totalsByCurrency = subsData?.totals_by_currency || {};

  const subscriptions = [...rawSubscriptions].sort((a, b) => {
    // Gmail-sourced subscriptions go after manually added / screenshot ones
    const aIsGmail = a.source === 'gmail';
    const bIsGmail = b.source === 'gmail';

    if (aIsGmail && bIsGmail) {
      // Both gmail — sort A-Z by name
      return (a.service_name || '').localeCompare(b.service_name || '');
    }
    if (aIsGmail !== bIsGmail) {
      // Non-gmail (newer added) first
      return aIsGmail ? 1 : -1;
    }
    // Both non-gmail — newest first by created_at
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const inactiveSubs = subscriptions.filter((s) => s.status !== 'active');

  // Group active subs by platform
  const appleSubs = activeSubs.filter((s) => s.platform === 'app_store');
  const googleSubs = activeSubs.filter((s) => s.platform === 'play_store');
  const webSubs = activeSubs.filter((s) => s.platform === 'web');
  const manualSubs = activeSubs.filter(
    (s) => !s.platform || s.platform === 'manual' || !['app_store', 'play_store', 'web'].includes(s.platform),
  );

  const handleCancel = useCallback(
    async (subId) => {
      try {
        const res = await fetch(`/api/subscriptions/${subId}/cancel`, {
          method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to cancel subscription');
        sendGTMEvent({ event: 'subscription_cancelled' });
        await mutate();
      } catch (err) {
        console.error('Cancel failed:', err);
        throw err;
      }
    },
    [mutate],
  );

  const handleDelete = useCallback(
    async (subId) => {
      try {
        const res = await fetch(`/api/subscriptions/${subId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete subscription');
        sendGTMEvent({ event: 'subscription_deleted' });
        await mutate();
      } catch (err) {
        console.error('Delete failed:', err);
        throw err;
      }
    },
    [mutate],
  );

  const [processing, setProcessing] = useState(false);
  const pollRef = useRef(null);

  const pollForResult = useCallback(
    (messageId) => {
      if (pollRef.current) clearInterval(pollRef.current);
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
        } catch (err) {
          console.error('Poll failed:', err);
        }

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

  const [gmailError, setGmailError] = useState(null);
  // Show promo instantly if localStorage flag not set (hide later if gmail connected or subs exist)
  const [showGmailPromo, setShowGmailPromo] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('gmail_promo_dismissed');
  });

  // Hide promo once we know user has subs or gmail connected
  useEffect(() => {
    if (!showGmailPromo) return;
    if (!loading && rawSubscriptions.length > 0) {
      setShowGmailPromo(false);
      return;
    }
    if (!loading) {
      fetch('/api/gmail/status')
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.connected) setShowGmailPromo(false);
        })
        .catch(() => {});
    }
  }, [loading, rawSubscriptions.length, showGmailPromo]);

  const handleGmailConnect = useCallback(async () => {
    setGmailError(null);
    try {
      // Check if already connected
      const statusRes = await fetch('/api/gmail/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.connected) {
          setShowGmailPromo(false);
          setGmailScanning(true);
          return;
        }
      }

      // Not connected — get OAuth URL and redirect
      const connectRes = await fetch('/api/gmail/connect');
      if (connectRes.ok) {
        const connectData = await connectRes.json();
        if (connectData.url) {
          window.location.href = connectData.url;
          return;
        }
      }

      // Error — hide promo, show error
      setShowGmailPromo(false);
      setGmailError('Gmail is temporarily unavailable. Please try again later.');
    } catch (err) {
      console.error('Gmail connect error:', err);
      setShowGmailPromo(false);
      setGmailError('Gmail is temporarily unavailable. Please try again later.');
    }
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
        {refreshing && <div className={styles.refreshBar} />}
      </header>
      <main className={styles.main}>
        {processing && (
          <div className={styles.processingBar}>
            <div className={styles.loading}>Analyzing your screenshot...</div>
          </div>
        )}
        {loading ? (
          <div className={styles.loaderWrap}>
            <div className={styles.loading}>Loading...</div>
          </div>
        ) : subscriptions.length === 0 && !processing ? (
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
            {[
              { label: 'App Store', subs: appleSubs },
              { label: 'Google Play', subs: googleSubs },
              { label: 'Web', subs: webSubs },
              { label: 'Added Manually', subs: manualSubs },
            ].filter((g) => g.subs.length > 0).map((g) => (
              <div key={g.label}>
                <div className={styles.sectionLabel}>{g.label}</div>
                <div className={styles.group}>
                  {g.subs.map((sub, i) => (
                    <div key={sub.id}>
                      <SubscriptionCard
                        subscription={sub}
                        onClick={() => setSelectedSub(sub)}
                      />
                      {i < g.subs.length - 1 && <div className={styles.divider} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {inactiveSubs.length > 0 && (
              <>
                <div className={styles.sectionLabel}>Inactive</div>
                <div className={styles.group}>
                  {inactiveSubs.map((sub, i) => (
                    <div key={sub.id}>
                      <SubscriptionCard
                        subscription={sub}
                        onClick={() => setSelectedSub(sub)}
                      />
                      {i < inactiveSubs.length - 1 && <div className={styles.divider} />}
                    </div>
                  ))}
                </div>
              </>
            )}
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
      {gmailError && (
        <div className={styles.gmailError}>
          <span>{gmailError}</span>
          <button onClick={() => setGmailError(null)}>✕</button>
        </div>
      )}
      {menuOpen && (
        <AddSourceMenu
          onClose={() => setMenuOpen(false)}
          onUploadComplete={handleUploadComplete}
          onManualAdd={() => setManualAddOpen(true)}
          onGmailConnect={handleGmailConnect}
        />
      )}
      <div className={styles.tapbarWrap}>
        <TapBar current="home" />
      </div>
      {manualAddOpen && (
        <AddSubscription
          onClose={() => setManualAddOpen(false)}
          onSave={() => mutate()}
        />
      )}
      {gmailScanning && (
        <GmailScanProgress
          onClose={() => setGmailScanning(false)}
          onComplete={() => {
            setGmailScanning(false);
            mutate();
          }}
        />
      )}
      {showGmailPromo && (
        <GmailPromo
          onConnect={() => {
            localStorage.setItem('gmail_promo_dismissed', '1');
            handleGmailConnect();
          }}
          onSkip={() => {
            localStorage.setItem('gmail_promo_dismissed', '1');
            setShowGmailPromo(false);
          }}
        />
      )}
      {selectedSub && (
        <SubscriptionDetail
          subscription={subscriptions.find((s) => s.id === selectedSub.id) || selectedSub}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onClose={() => {
            setSelectedSub(null);
            mutate();
          }}
        />
      )}
    </div>
  );
}
