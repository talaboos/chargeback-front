'use client';

import { useState } from 'react';
import { getCachedStage, setCachedStage, getLogoSrc } from '@/utils/logoCache';
import { formatAmount as fmtAmount, formatDate } from '@/utils/format';
import styles from './card.module.scss';

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function formatRenewal(subscription) {
  const { status, next_renewal_date, subscription_end_date } = subscription;

  if (status === 'cancelled' || status === 'expired') {
    const date = subscription_end_date || next_renewal_date;
    if (!date) return status === 'cancelled' ? 'Cancelled' : 'Expired';
    const label = status === 'cancelled' ? 'Expires' : 'Expired';
    return `${label} ${formatDate(date)}`;
  }

  if (!next_renewal_date) return null;
  return `Renews ${formatDate(next_renewal_date)}`;
}

function formatAmount(amount, currency) {
  const result = fmtAmount(amount, currency);
  return result === '\u2014' ? null : result;
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
