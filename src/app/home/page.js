'use client';

import { useTransition } from 'react';
import { useAtom } from 'jotai/index';

import TapBar from '@/components/TapBar';
import UploadImage from '@/components/UploadImage';

import { uploadFile } from '@/action/uploadFile';
import useFetch from '@/hooks/useFetch';
import { idAtom } from '@/state/atoms/idAtom';

import styles from './page.module.scss';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [id, setId] = useAtom(idAtom);
  const { data } = useFetch(id ? `/api/gpt?id=${id}` : null, {
    refreshInterval: (res) => {
      if (res && res.status === 'completed') {
        return 0;
      }

      return 500;
    },
  });

  const onUploadScreen = async (file) => {
    startTransition(async () => {
      const { success, message, data: screen } = await uploadFile(file);
      if (success) {
        setId(screen.id);
      } else {
        console.error(message || 'Something is wrong');
      }
    });
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
              if (data?.status === 'processing')
                return <div className={styles.loading}>Processing...</div>;
              if (data?.status === 'completed')
                return (
                  <div className={styles.tab}>
                    {(() => {
                      const sub = data.data?.subscriptions;
                      if (sub.length) {
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
                <div className={styles.about}>
                  Upload a screenshot with you subscriptions or any other bills
                </div>
              );
            })()}
          </div>
        </div>
        <div className={styles.buttons}>
          <UploadImage
            onChange={(file) => onUploadScreen(file)}
            pending={isPending}
          />
        </div>
        <TapBar current="home" />
      </main>
    </div>
  );
}
