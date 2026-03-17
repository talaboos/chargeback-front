'use client';

import { useState } from 'react';
import { getCachedStage, setCachedStage, getLogoSrc } from '@/utils/logoCache';
import styles from './card.module.scss';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAmount(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num);
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

export default function SubscriptionCard({ subscription, onClick, onCancel, cancelling, error, onDismissError }) {
  const domain = subscription.service_domain;
  const [logoStage, setLogoStage] = useState(() => getCachedStage(domain));
  const isCancelled = subscription.status === 'cancelled';

  const handleImgError = () => {
    setLogoStage((prev) => {
      const next = prev + 1;
      setCachedStage(domain, next);
      return next;
    });
  };

  const logoSrc = getLogoSrc(domain, logoStage);

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.card} ${isCancelled ? styles.cancelled : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className={styles.logo}>
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={subscription.service_name}
              width={40}
              height={40}
              onError={handleImgError}
            />
          ) : (
            <div className={styles.fallback}>
              {getInitial(subscription.service_name)}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{subscription.service_name}</div>
          <div className={styles.renewal}>
            {isCancelled
              ? 'Cancelled'
              : `Renews ${formatDate(subscription.next_renewal_date)}`}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.amount}>
            {formatAmount(subscription.amount, subscription.currency)}
          </div>
          <div className={styles.cycle}>/{subscription.billing_cycle}</div>
        </div>
        {!isCancelled && onCancel && (
          <button
            className={styles.cancelBtn}
            onClick={(e) => {
              e.stopPropagation();
              onCancel(subscription.id);
            }}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>
      {error && (
        <div className={styles.errorToast}>
          <span>{error}</span>
          <button className={styles.errorDismiss} onClick={onDismissError}>&times;</button>
        </div>
      )}
    </div>
  );
}
