'use client';

import Image from 'next/image';
import { useAtom } from 'jotai';

import { modalAtom, modalContent, modalOpen } from '@/state/atoms/modalAtom';

import styles from './modal.module.scss';

export default function Modal() {
  const [content] = useAtom(modalContent);
  const [opened] = useAtom(modalOpen);
  const [, setModal] = useAtom(modalAtom);

  const onClose = () => {
    setModal({
      open: false,
    });
  };

  if (!opened || !opened?.open) return null;

  if (opened.type === 'window') {
    return <div className={styles.window}>{content}</div>;
  }

  if (opened.type === 'player') {
    return (
      <div className={styles.playerWrapper}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="40" height="40" rx="16" fill="white" />
            <path
              d="M15 15L25 25"
              stroke="#1A1A2E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M25 15L15 25"
              stroke="#1A1A2E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {content}
      </div>
    );
  }

  if (opened.type === 'picture') {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={styles.picture}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="40"
                height="40"
                rx="16"
                fill="black"
                fillOpacity="0.16"
              />
              <path
                d="M15 15L25 25"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M25 15L15 25"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className={styles.body}>{content}</div>
        </div>
      </div>
    );
  }

  if (opened.type === 'info') {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.body}>{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose}>
          <Image
            src="/ico-close.svg"
            priority
            width={40}
            height={40}
            alt="Close"
          />
        </button>
        <div className={styles.body}>{content}</div>
      </div>
    </div>
  );
}
