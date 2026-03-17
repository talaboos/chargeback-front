'use client';

import { useState } from 'react';
import { getCachedStage, setCachedStage, getLogoSrc } from '@/utils/logoCache';
import styles from './card.module.scss';

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function formatRenewal(subscription) {
  const { status, next_renewal_date, subscription_end_date } = subscription;

  if (status === 'cancelled' || status === 'expired') {
    const date = subscription_end_date || next_renewal_date;
    if (!date) return status === 'cancelled' ? 'Cancelled' : 'Expired';
    const d = new Date(date);
    const label = status === 'cancelled' ? 'Expires' : 'Expired';
    return `${label} ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
  }

  if (!next_renewal_date) return null;
  const d = new Date(next_renewal_date);
  return `Renews ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
}

function formatAmount(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num);
}

export default function SubscriptionCard({ subscription, onClick }) {
  const domain = subscription.service_domain;
  const [logoStage, setLogoStage] = useState(() => getCachedStage(domain));
  const isInactive = subscription.status === 'cancelled' || subscription.status === 'expired';

  const handleImgError = () => {
    setLogoStage((prev) => {
      const next = prev + 1;
      setCachedStage(domain, next);
      return next;
    });
  };

  const logoSrc = getLogoSrc(domain, logoStage);
  const renewal = formatRenewal(subscription);
  const plan = subscription.subscription_plan && subscription.subscription_plan !== 'Not specified'
    ? subscription.subscription_plan
    : subscription.category && subscription.category !== 'Not specified'
      ? subscription.category
      : null;
  const price = formatAmount(subscription.amount, subscription.currency);

  return (
    <div
      className={`${styles.card} ${isInactive ? styles.cancelled : ''}`}
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
        <div className={`${styles.sub} ${isInactive ? styles.expiring : ''}`}>
          {plan && !isInactive ? plan : null}
          {plan && !isInactive && renewal ? ' · ' : null}
          {renewal}
        </div>
      </div>
      <div className={styles.right}>
        {price && !isInactive && <span className={styles.amount}>{price}</span>}
        <span className={styles.chevron}>›</span>
      </div>
    </div>
  );
}
