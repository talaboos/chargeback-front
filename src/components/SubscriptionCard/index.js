'use client';

import { useState } from 'react';
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

const LOGO_STAGE_GOOGLE = 0;
const LOGO_STAGE_CLEARBIT = 1;
const LOGO_STAGE_FALLBACK = 2;

function getLogoSrc(domain, stage) {
  if (stage === LOGO_STAGE_GOOGLE && domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }
  if (stage === LOGO_STAGE_CLEARBIT && domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  return null;
}

export default function SubscriptionCard({ subscription, onClick }) {
  const [logoStage, setLogoStage] = useState(LOGO_STAGE_GOOGLE);
  const isCancelled = subscription.status === 'cancelled';
  const domain = subscription.service_domain;

  const handleImgError = () => {
    setLogoStage((prev) => prev + 1);
  };

  const logoSrc = getLogoSrc(domain, logoStage);

  return (
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
    </div>
  );
}
