'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai/index';
import { sendGTMEvent } from '@next/third-parties/google';

import TapBar from '@/components/TapBar';
import AddSourceMenu from '@/components/AddSourceMenu';

import useFetch from '@/hooks/useFetch';
import { idAtom } from '@/state/atoms/idAtom';

import styles from './page.module.scss';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [id, setId] = useAtom(idAtom);

  useEffect(() => {
    if (!id) {
      fetch('/api/history')
        .then((res) => res.json())
        .then((data) => {
          if (data?.lastResultId) {
            setId(data.lastResultId);
          }
        })
        .catch(() => {})
        .finally(() => setHistoryLoaded(true));
    } else {
      setHistoryLoaded(true);
    }
  }, [id, setId]);

  const { data } = useFetch(id ? `/api/gpt?id=${id}` : null, {
    refreshInterval: (res) => {
      if (res && res.status === 'completed') {
        sendGTMEvent({ event: 'user_file_get_data' });

        return 0;
      }

      return 500;
    },
  });

  const handleUploadComplete = (result) => {
    if (result?.data?.id) {
      sendGTMEvent({ event: 'user_file_attached' });
      setId(result.data.id);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.top}>Home</div>
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.info}>
            {(() => {
              if (!historyLoaded)
                return <div className={styles.loading}>Loading...</div>;
              if (data?.status === 'processing')
                return <div className={styles.loading}>Processing...</div>;
              if (data?.status === 'completed')
                return (
                  <div className={styles.tab}>
                    {(() => {
                      const sub = data.data?.subscriptions;
                      if (sub?.length) {
                        return sub.map((item) => {
                          return Object.entries(item).map(([key, value]) => (
                            <div
                              className={styles.line}
                              style={
                                key === 'service_name'
                                  ? {
                                      margin: '15px 0',
                                      color: '#fff',
                                      background: '#6361f3',
                                      borderRadius: '5px',
                                    }
                                  : {}
                              }
                              key={key}
                            >
                              <div>{key.replace(/_/g, ' ')}:</div>
                              <div>{value}</div>
                            </div>
                          ));
                        });
                      } else {
                        return (
                          <div className={styles.result}>
                            Could not get screenshot information. Try another
                            one...
                          </div>
                        );
                      }
                    })()}
                  </div>
                );

              return (
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
                  <div className={styles.emptyTitle}>No data sources yet</div>
                  <div className={styles.emptyDescription}>
                    Add a data source to start tracking your subscriptions and charges
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <button
          className={styles.fab}
          onClick={() => setMenuOpen(true)}
          aria-label="Add data source"
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
        <TapBar current="home" />
      </main>
    </div>
  );
}
